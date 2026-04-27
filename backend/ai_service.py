import os
import json
import re
import logging
import asyncio
from typing import Dict, Any, List
from google import genai
from google.genai import types
from google.genai.errors import ServerError

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
PRIMARY_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash-lite")

_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def _extract_json(text: str) -> Dict[str, Any]:
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    decoder = json.JSONDecoder()
    idx = 0
    while idx < len(text):
        idx = text.find("{", idx)
        if idx == -1:
            break
        try:
            obj, _ = decoder.raw_decode(text, idx)
            return obj
        except json.JSONDecodeError:
            idx += 1
    raise ValueError("No JSON object found in response")


async def _call_model(model: str, system: str, user_text: str, max_tokens: int, temperature: float) -> str:
    response = await _client.aio.models.generate_content(
        model=model,
        contents=user_text,
        config=types.GenerateContentConfig(
            system_instruction=system,
            temperature=temperature,
            max_output_tokens=max_tokens,
        ),
    )
    text = (response.text or "").strip()
    if not text:
        raise RuntimeError(f"AI model {model} returned an empty response")
    return text


async def _chat(session_id: str, system: str, user_text: str, max_tokens: int = 4000, temperature: float = 0.7) -> str:
    if not _client:
        raise RuntimeError("AI service is not configured")

    for attempt in range(2):
        try:
            return await _call_model(PRIMARY_MODEL, system, user_text, max_tokens, temperature)
        except ServerError:
            if attempt < 1:
                logger.warning("Primary AI model returned 503, retrying in 3s (attempt %d/2)", attempt + 1)
                await asyncio.sleep(3)
            else:
                logger.warning("Primary AI model failed twice")
                raise


ATS_SYSTEM = """You are a senior ATS optimization expert and professional resume reviewer with 15+ years of experience.
Your job is to analyze a resume and return a structured JSON response with scores, issues, and fixes.
You must respond ONLY with a valid JSON object matching the schema below — no prose, no markdown, no code fences.

Schema:
{
  "score": <int 0-100>,
  "verdict": "EXCELLENT" | "GOOD" | "NEEDS WORK",
  "metrics": [
    {"label": "Keywords Match", "score": <int 0-100>, "color": "#0D6B4F"|"#4F8EF7"|"#F59E0B"|"#EF4444"},
    {"label": "Formatting / ATS Parse", "score": <int>, "color": ...},
    {"label": "Skills Section", "score": <int>, "color": ...},
    {"label": "Work Experience", "score": <int>, "color": ...},
    {"label": "Education", "score": <int>, "color": ...},
    {"label": "Quantifiable Impact", "score": <int>, "color": ...}
  ],
  "keywords": [list of strong keywords found in resume],
  "missing_keywords": [list of high-value keywords that should be added],
  "pros": [6-8 concise strengths as full sentences],
  "cons": [6-10 concise issues as full sentences],
  "fixes": [
    {"priority": "HIGH"|"MEDIUM"|"LOW", "section": <section name>, "fix": <actionable fix sentence>}
  ]
}

Color rules: >=80 green #0D6B4F, 60-79 blue #4F8EF7, 40-59 amber #F59E0B, <40 red #EF4444.
Provide at least 6 fixes. Be specific and actionable."""


async def analyze_ats(resume_text: str, target_role: str = "") -> Dict[str, Any]:
    user = f"Target Role: {target_role or 'Not specified'}\n\nRESUME TEXT:\n---\n{resume_text[:12000]}\n---\n\nReturn the JSON analysis now."
    try:
        out = await _chat(session_id=f"ats-{abs(hash(resume_text[:200]))}", system=ATS_SYSTEM, user_text=user, max_tokens=5000, temperature=0)
        data = _extract_json(out)
        return data
    except Exception as e:
        logger.exception("ATS analysis failed")
        raise


JD_SYSTEM = """You are an expert resume tailoring AI. Given a user's resume and a target Job Description (JD),
produce a JSON analysis with keywords, section changes, and a tailored summary/skills list.
Respond ONLY with valid JSON matching this schema:

{
  "candidate_name": <full name extracted from the resume, or "Your Name" if not found>,
  "match_score": <int 0-100>,
  "keywords_added": [keywords newly recommended to add based on the JD],
  "keywords_present": [keywords already in resume that match the JD],
  "sections_updated": [ {"section": <name>, "change": <what to change/add>} ],
  "unchanged_sections": [list of section names that don't need changes],
  "tailored_summary": <rewritten 3-4 sentence Professional Summary aligned to JD>,
  "tailored_skills": [re-ordered/added skill list aligned to JD],
  "job_title": <job title parsed from JD>,
  "company": <company parsed from JD or empty string>
}

Be specific, actionable, and align tone to the JD."""


async def tailor_to_jd(resume_text: str, jd_text: str) -> Dict[str, Any]:
    user = f"RESUME:\n---\n{resume_text[:8000]}\n---\n\nJOB DESCRIPTION:\n---\n{jd_text[:6000]}\n---\n\nReturn the JSON now."
    out = await _chat(session_id=f"jd-{abs(hash(resume_text[:100] + jd_text[:100]))}", system=JD_SYSTEM, user_text=user, max_tokens=4500, temperature=0)
    return _extract_json(out)


EXTRACT_SYSTEM = """You are a resume parser. Extract personal contact information from the resume text.
Respond ONLY with a valid JSON object. If a field is not found, use an empty string.

Schema:
{
  "name": <full name>,
  "email": <email address>,
  "phone": <phone number>,
  "location": <city/state/country>,
  "linkedin": <linkedin URL or username>,
  "github": <github URL or username>
}"""


async def extract_personal_info(resume_text: str) -> Dict[str, Any]:
    user = f"Extract personal info from this resume:\n\n{resume_text[:5000]}"
    try:
        out = await _chat(session_id=f"extract-{abs(hash(resume_text[:100]))}", system=EXTRACT_SYSTEM, user_text=user, max_tokens=500)
        return _extract_json(out)
    except Exception:
        logger.exception("Personal info extraction failed")
        return {}


GEN_SYSTEM = """You are a resume writing expert. Generate high-quality, ATS-friendly, quantifiable
resume content. Use active voice, strong verbs, and include metrics where possible.
Respond ONLY with valid JSON: {"text": <generated content>, "suggestions": [3 alternative versions]}"""


async def generate_content(prompt: str, context: str = "", kind: str = "summary") -> Dict[str, Any]:
    kind_prompts = {
        "summary": "Generate a professional 3-4 sentence resume Summary.",
        "bullet": "Generate a single resume bullet point with a strong action verb and quantifiable impact.",
        "skills": "Generate a focused list of 10-15 relevant skills, comma-separated in the text field.",
        "cover_letter": "Generate a 3-paragraph cover letter body.",
    }
    instruction = kind_prompts.get(kind, kind_prompts["summary"])
    user = f"{instruction}\n\nPROMPT: {prompt}\n\nCONTEXT:\n{context[:3000] if context else '(none)'}\n\nReturn JSON only."
    out = await _chat(session_id=f"gen-{abs(hash(prompt[:100]))}", system=GEN_SYSTEM, user_text=user, max_tokens=1500)
    return _extract_json(out)


APPLY_FIXES_SYSTEM = """You are an expert resume writer and ATS optimization specialist.
You are given a resume and a list of ATS fixes that need to be applied.
Apply ALL the fixes to the resume and return the improved resume as structured JSON.
Respond ONLY with a valid JSON object matching this exact schema — no prose, no markdown.

{
  "personal": {
    "name": <full name from resume>,
    "title": <professional title/headline>,
    "email": <email>,
    "phone": <phone>,
    "location": <city, country>,
    "linkedin": <linkedin url or empty string>,
    "github": <github url or empty string>,
    "website": <website or empty string>
  },
  "summary": <rewritten 3-4 sentence professional summary with ATS fixes applied>,
  "experiences": [
    {
      "company": <company name>,
      "role": <job title>,
      "period": <date range e.g. "Jan 2021 – Present">,
      "location": <location or empty string>,
      "bullets": [<rewritten bullet points with strong action verbs, quantified impact, and ATS keywords>]
    }
  ],
  "education": [
    {
      "school": <institution name>,
      "degree": <degree and field>,
      "period": <date range>,
      "cgpa": <GPA or empty string>
    }
  ],
  "skills": [<complete list of skills — original + newly added keywords from fixes>],
  "certifications": [
    {"name": <cert name>, "issuer": <issuer>, "date": <date or empty string>}
  ],
  "languages": [],
  "projects": [],
  "customSections": []
}

Rules:
- Apply every fix provided — quantify bullets, add missing keywords, rewrite weak phrases, add summary if missing
- Keep all original information — do not remove companies, schools, or actual experience
- Expand skills list with keywords mentioned in fixes
- Make bullets start with strong action verbs (Led, Built, Improved, Reduced, Delivered, etc.)
- Add metrics/numbers wherever the fix suggests quantification (estimate reasonable numbers if not given)
- Return complete JSON only"""


async def apply_ats_fixes(resume_text: str, fixes: List[Dict], target_role: str = "") -> Dict[str, Any]:
    fixes_text = "\n".join([f"- [{f.get('priority','MEDIUM')}] {f.get('section','')}: {f.get('fix','')}" for f in fixes])
    user = (
        f"TARGET ROLE: {target_role or 'Not specified'}\n\n"
        f"ORIGINAL RESUME:\n---\n{resume_text[:10000]}\n---\n\n"
        f"FIXES TO APPLY:\n{fixes_text}\n\n"
        f"Apply all fixes and return the improved resume as JSON now."
    )
    try:
        out = await _chat(
            session_id=f"apply-{abs(hash(resume_text[:100]))}",
            system=APPLY_FIXES_SYSTEM,
            user_text=user,
            max_tokens=6000,
            temperature=0,
        )
        return _extract_json(out)
    except Exception:
        logger.exception("Apply ATS fixes failed")
        raise
