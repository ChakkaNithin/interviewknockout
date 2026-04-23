import os
import json
import re
import logging
from typing import Dict, Any, List
import google.generativeai as genai

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL_NAME = "gemini-2.0-flash-exp"

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def _extract_json(text: str) -> Dict[str, Any]:
    """Extract JSON from LLM response (handles code blocks and trailing text)."""
    # Remove code fences
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    # Find first { ... last }
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in response")
    snippet = text[start:end + 1]
    return json.loads(snippet)


async def _chat(session_id: str, system: str, user_text: str, max_tokens: int = 4000) -> str:
    """Send a chat request to Gemini API."""
    try:
        model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            generation_config={
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": max_tokens,
            },
            system_instruction=system
        )
        
        response = model.generate_content(user_text)
        return response.text
    except Exception as e:
        logger.exception(f"Gemini API call failed: {e}")
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
        out = await _chat(session_id=f"ats-{abs(hash(resume_text[:200]))}", system=ATS_SYSTEM, user_text=user, max_tokens=5000)
        data = _extract_json(out)
        return data
    except Exception as e:
        logger.exception("ATS analysis failed")
        raise


JD_SYSTEM = """You are an expert resume tailoring AI. Given a user's resume and a target Job Description (JD),
produce a JSON analysis with keywords, section changes, and a tailored summary/skills list.
Respond ONLY with valid JSON matching this schema:

{
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
    out = await _chat(session_id=f"jd-{abs(hash(resume_text[:100] + jd_text[:100]))}", system=JD_SYSTEM, user_text=user, max_tokens=4500)
    return _extract_json(out)


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
