import os
import logging
import asyncio
from typing import List, Dict, Any, Optional
import pandas as pd

logger = logging.getLogger(__name__)

SERPAPI_KEY = os.environ.get("SERPAPI_KEY", "")

SITE_MAP = {
    "linkedin": "linkedin",
    "indeed": "indeed",
    "glassdoor": "glassdoor",
    "zip_recruiter": "zip_recruiter",
    "naukri": "naukri",
    "google": "google",
    "bayt": "bayt",
}


def _score_job(job: Dict[str, Any], user_skills: List[str]) -> (int, str):
    """Compute a match score 0-100 based on user skills vs job description/title."""
    if not user_skills:
        return 70, "GOOD"
    text = f"{job.get('title', '')} {job.get('description', '')}".lower()
    matched = sum(1 for s in user_skills if s.lower() in text)
    pct = min(100, int((matched / max(1, len(user_skills))) * 100) + 20)
    if pct >= 85:
        return pct, "EXCELLENT"
    if pct >= 65:
        return pct, "GOOD"
    if pct >= 45:
        return pct, "FAIR"
    return pct, "LOW"


def _extract_skills(description: str) -> List[str]:
    if not description:
        return []
    common = ["Python", "Java", "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js",
             "FastAPI", "Django", "Flask", "Spring", "SQL", "PostgreSQL", "MongoDB", "Redis",
             "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Git",
             "LangChain", "LangGraph", "LLM", "RAG", "NLP", "ML", "TensorFlow", "PyTorch",
             "OpenAI", "Azure OpenAI", "AWS Bedrock", "Pinecone", "Vector DB", "Neo4j",
             "Agile", "Scrum", "REST", "GraphQL", "Microservices"]
    desc_lower = description.lower()
    return [s for s in common if s.lower() in desc_lower][:8]


def _safe(val):
    if val is None:
        return ""
    try:
        if pd.isna(val):
            return ""
    except Exception:
        pass
    return val


def _relative_date(date_val) -> str:
    if not date_val:
        return "Recently"
    try:
        if isinstance(date_val, str):
            date_val = pd.to_datetime(date_val, errors="coerce")
        if pd.isna(date_val):
            return "Recently"
        delta = pd.Timestamp.now() - date_val
        days = delta.days
        if days == 0:
            return "Today"
        if days == 1:
            return "1 day ago"
        if days < 7:
            return f"{days} days ago"
        weeks = days // 7
        if weeks == 1:
            return "1 week ago"
        return f"{weeks} weeks ago"
    except Exception:
        return "Recently"


def _run_jobspy_sync(search_term: str, location: str, sites: List[str], hours_old: int, is_remote: Optional[bool], results_per_site: int) -> List[Dict[str, Any]]:
    """Synchronous wrapper for jobspy (run in thread)."""
    try:
        from jobspy import scrape_jobs
    except Exception as e:
        logger.exception("jobspy import failed")
        return []

    site_names = [s for s in sites if s in SITE_MAP and s != "google"]
    if not site_names:
        return []

    try:
        df = scrape_jobs(
            site_name=site_names,
            search_term=search_term,
            location=location,
            results_wanted=results_per_site,
            hours_old=hours_old,
            is_remote=is_remote,
            country_indeed="India" if "india" in location.lower() else "USA",
            verbose=0,
        )
    except Exception as e:
        logger.exception(f"jobspy scrape failed: {e}")
        return []

    if df is None or len(df) == 0:
        return []

    jobs = []
    for _, row in df.iterrows():
        jobs.append({
            "site": _safe(row.get("site", "")),
            "title": _safe(row.get("title", "")),
            "company": _safe(row.get("company", "")),
            "location": _safe(row.get("location", "")),
            "job_type": _safe(row.get("job_type", "Full-time")),
            "date_posted": _relative_date(row.get("date_posted")),
            "is_remote": bool(_safe(row.get("is_remote", False))),
            "min_amount": _safe(row.get("min_amount")) or None,
            "max_amount": _safe(row.get("max_amount")) or None,
            "currency": _safe(row.get("currency", "")),
            "description": _safe(row.get("description", ""))[:2000] if row.get("description") else "",
            "job_url": _safe(row.get("job_url", "#")) or "#",
        })
    return jobs


def _run_serpapi_google_jobs_sync(search_term: str, location: str, results: int = 10) -> List[Dict[str, Any]]:
    """Fetch Google Jobs via SerpApi."""
    if not SERPAPI_KEY:
        return []
    try:
        from serpapi import GoogleSearch
    except Exception:
        try:
            from serpapi.google_search import GoogleSearch
        except Exception:
            logger.exception("serpapi import failed")
            return []
    try:
        params = {
            "engine": "google_jobs",
            "q": f"{search_term} {location}",
            "location": location,
            "api_key": SERPAPI_KEY,
        }
        search = GoogleSearch(params)
        results_data = search.get_dict()
        jobs_raw = results_data.get("jobs_results", [])[:results]
    except Exception as e:
        logger.exception(f"SerpApi google_jobs failed: {e}")
        return []

    jobs = []
    for j in jobs_raw:
        detected = j.get("detected_extensions", {}) or {}
        jobs.append({
            "site": "google",
            "title": j.get("title", ""),
            "company": j.get("company_name", ""),
            "location": j.get("location", location),
            "job_type": detected.get("schedule_type", "Full-time"),
            "date_posted": detected.get("posted_at", "Recently"),
            "is_remote": "remote" in (j.get("location", "").lower()) or detected.get("work_from_home", False),
            "min_amount": None,
            "max_amount": None,
            "currency": "",
            "description": (j.get("description", "") or "")[:2000],
            "job_url": j.get("share_link") or (j.get("apply_options", [{}])[0].get("link", "#") if j.get("apply_options") else "#"),
        })
    return jobs


async def search_jobs(search_term: str, location: str, sites: List[str], hours_old: int, is_remote: Optional[bool], results_per_site: int, use_serpapi: bool, resume_skills: List[str]) -> List[Dict[str, Any]]:
    loop = asyncio.get_event_loop()

    tasks = []
    # JobSpy
    non_google_sites = [s for s in sites if s != "google"]
    if non_google_sites:
        tasks.append(loop.run_in_executor(None, _run_jobspy_sync, search_term, location, non_google_sites, hours_old, is_remote, results_per_site))
    # SerpApi Google Jobs
    if use_serpapi and "google" in sites:
        tasks.append(loop.run_in_executor(None, _run_serpapi_google_jobs_sync, search_term, location, results_per_site))

    all_jobs: List[Dict[str, Any]] = []
    if tasks:
        try:
            results = await asyncio.wait_for(asyncio.gather(*tasks, return_exceptions=True), timeout=90)
            for r in results:
                if isinstance(r, list):
                    all_jobs.extend(r)
                elif isinstance(r, Exception):
                    logger.error(f"search task failed: {r}")
        except asyncio.TimeoutError:
            logger.warning("Job search timed out")

    # Post-process: score and format
    enriched = []
    for j in all_jobs:
        if not j.get("title"):
            continue
        skills = _extract_skills(j.get("description", ""))
        score, priority = _score_job(j, resume_skills)
        loc = j.get("location", "") or ""
        currency = j.get("currency") or ("LPA" if "india" in loc.lower() else "USD")
        enriched.append({
            **j,
            "skills": skills,
            "score": score,
            "priority": priority,
            "currency": currency,
            "company_rating": 4.0,
            "experience_range": "2-7 years",
        })

    # Sort by score desc
    enriched.sort(key=lambda x: x.get("score", 0), reverse=True)
    return enriched
