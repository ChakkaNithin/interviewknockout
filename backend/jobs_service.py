import os
import logging
from typing import List, Dict, Any, Optional
import httpx

logger = logging.getLogger(__name__)

THEIRSTACK_API_KEY = os.environ.get("THEIRSTACK_API_KEY", "")
THEIRSTACK_API_URL = "https://api.theirstack.com/v1/jobs/search"


def _score_job(job: Dict[str, Any], user_skills: List[str]) -> tuple[int, str]:
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


def _relative_date(date_str: str) -> str:
    """Convert ISO date string to relative time."""
    if not date_str:
        return "Recently"
    try:
        from datetime import datetime, timezone
        date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        delta = datetime.now(timezone.utc) - date_obj
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


def _map_theirstack_job(job_data: Dict[str, Any], user_skills: List[str]) -> Dict[str, Any]:
    """Map TheirStack job response to our internal format."""
    company = job_data.get("company_object", {}) or {}
    
    # Extract salary info
    min_salary = job_data.get("min_salary_usd")
    max_salary = job_data.get("max_salary_usd")
    
    # Extract location
    location = job_data.get("location", "")
    if not location and job_data.get("locations"):
        first_loc = job_data["locations"][0]
        city = first_loc.get("city", "")
        country = first_loc.get("country_code", "")
        location = f"{city}, {country}" if city and country else (city or country or "Remote")
    
    # Extract company info
    company_name = company.get("name", "Unknown Company")
    company_domain = company.get("domain", "")
    
    # Extract job details
    title = job_data.get("title", "")
    description = job_data.get("text", "") or job_data.get("description", "")
    job_url = job_data.get("url", "#")
    date_posted = job_data.get("date_posted", "")
    is_remote = job_data.get("remote", False)
    
    # Extract technologies from job
    technologies = job_data.get("technologies", [])
    tech_names = [t.get("name", "") for t in technologies if isinstance(t, dict) and t.get("name")][:8]
    
    # If no tech from API, extract from description
    if not tech_names:
        tech_names = _extract_skills(description)
    
    # Determine seniority/experience
    seniority = job_data.get("seniority", "")
    experience_map = {
        "junior": "0-2 years",
        "mid_level": "2-5 years",
        "senior": "5-8 years",
        "staff": "8-12 years",
        "c_level": "12+ years"
    }
    experience_range = experience_map.get(seniority, "2-7 years")
    
    # Company rating (use employee count as proxy if available)
    employee_count = company.get("employee_count", 0)
    company_rating = 4.0
    if employee_count:
        if employee_count > 10000:
            company_rating = 4.5
        elif employee_count > 1000:
            company_rating = 4.3
        elif employee_count < 50:
            company_rating = 3.8
    
    # Build job object
    job = {
        "site": "job_board",
        "title": title,
        "company": company_name,
        "location": location,
        "job_type": "Full-time",  # TheirStack doesn't always provide this
        "date_posted": _relative_date(date_posted),
        "is_remote": is_remote,
        "min_amount": min_salary,
        "max_amount": max_salary,
        "currency": "USD" if min_salary or max_salary else "",
        "description": description[:2000] if description else "",
        "job_url": job_url,
        "skills": tech_names,
        "experience_range": experience_range,
        "company_rating": company_rating,
        "company_domain": company_domain,
        "employee_count": employee_count,
        "funding": company.get("funding_usd"),
        "industry": company.get("industry", {}).get("name", "") if isinstance(company.get("industry"), dict) else "",
    }
    
    # Calculate match score
    score, priority = _score_job(job, user_skills)
    job["score"] = score
    job["priority"] = priority
    
    return job


async def search_jobs(
    search_term: str,
    location: str,
    hours_old: int,
    is_remote: Optional[bool],
    results_per_page: int,
    resume_skills: List[str],
    # TheirStack specific filters
    min_salary: Optional[int] = None,
    max_salary: Optional[int] = None,
    seniority_levels: Optional[List[str]] = None,
    technologies: Optional[List[str]] = None,
    min_employees: Optional[int] = None,
    max_employees: Optional[int] = None,
    min_funding: Optional[int] = None,
    max_funding: Optional[int] = None,
    industries: Optional[List[int]] = None,
    company_names: Optional[List[str]] = None,
    easy_apply: Optional[bool] = None,
    page: int = 0,
) -> List[Dict[str, Any]]:
    """Search jobs using TheirStack API."""
    
    if not THEIRSTACK_API_KEY:
        logger.error("THEIRSTACK_API_KEY not configured")
        raise ValueError("Job search API key not configured")
    
    # Calculate posted_at_max_age_days from hours_old
    posted_at_max_age_days = max(0, hours_old // 24)
    
    # Extract country code from location (simple heuristic)
    country_code = None
    location_lower = location.lower()
    country_map = {
        "india": "IN",
        "united states": "US",
        "usa": "US",
        "uk": "GB",
        "united kingdom": "GB",
        "canada": "CA",
        "australia": "AU",
        "germany": "DE",
        "singapore": "SG",
    }
    for country_name, code in country_map.items():
        if country_name in location_lower:
            country_code = code
            break
    
    # Build TheirStack request payload
    payload = {
        "job_title_or": [search_term] if search_term else [],
        "posted_at_max_age_days": posted_at_max_age_days,
        "limit": results_per_page,
        "page": page,
    }
    
    # Add optional filters
    if country_code:
        payload["job_country_code_or"] = [country_code]
    
    if is_remote is not None:
        payload["remote"] = is_remote
    
    if easy_apply is not None:
        payload["easy_apply"] = easy_apply
    
    if min_salary:
        payload["min_salary_usd"] = min_salary
    
    if max_salary:
        payload["max_salary_usd"] = max_salary
    
    if seniority_levels:
        payload["job_seniority_or"] = seniority_levels
    
    if technologies:
        payload["job_technology_slug_or"] = technologies
    
    if min_employees:
        payload["min_employee_count"] = min_employees
    
    if max_employees:
        payload["max_employee_count"] = max_employees
    
    if min_funding:
        payload["min_funding_usd"] = min_funding
    
    if max_funding:
        payload["max_funding_usd"] = max_funding
    
    if industries:
        payload["industry_id_or"] = industries
    
    if company_names:
        payload["company_name_or"] = company_names
    
    # Make API request
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                THEIRSTACK_API_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {THEIRSTACK_API_KEY}",
                    "Content-Type": "application/json",
                }
            )
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"TheirStack API error: {e.response.status_code} - {e.response.text}")
        raise ValueError(f"Job search failed: {e.response.status_code}")
    except Exception as e:
        logger.exception(f"TheirStack API request failed: {e}")
        raise ValueError(f"Job search failed: {str(e)}")
    
    # Parse response
    jobs_data = data.get("data", [])
    if not jobs_data:
        logger.warning("No jobs returned from API")
        return []
    
    # Map to our format
    enriched = []
    for job_data in jobs_data:
        try:
            mapped_job = _map_theirstack_job(job_data, resume_skills)
            enriched.append(mapped_job)
        except Exception as e:
            logger.warning(f"Failed to map job: {e}")
            continue
    
    # Sort by score desc
    enriched.sort(key=lambda x: x.get("score", 0), reverse=True)
    
    logger.info(f"Returned {len(enriched)} jobs from search")
    return enriched
