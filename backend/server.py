from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Optional

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from models import (
    UserSignup, UserLogin, GoogleAuthRequest, UserPublic, AuthResponse,
    ResumeCreate, ResumeUpdate, Resume, ResumeData,
    ATSAnalyzeRequest, ATSResult,
    JDTailorRequest, JDTailorResult,
    AIGenerateRequest, AIGenerateResponse,
    JobSearchRequest, JobSearchResponse, Job,
    uid,
)
from auth import hash_password, verify_password, create_access_token, get_current_user_id
import ai_service
import jobs_service
from file_utils import extract_text_from_upload

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'covera_ai')]

app = FastAPI(title="Covera.ai API", version="1.0.0")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def user_to_public(u: dict) -> UserPublic:
    return UserPublic(
        id=u["id"],
        email=u["email"],
        name=u["name"],
        plan=u.get("plan", "free"),
        avatar=u.get("avatar"),
        provider=u.get("provider", "email"),
        created_at=u.get("created_at", datetime.utcnow()),
    )


@api_router.get("/")
async def root():
    return {"name": "Covera.ai API", "status": "ok", "version": "1.0.0"}


@api_router.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "healthy", "db": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}


# ========== Auth ==========
@api_router.post("/auth/signup", response_model=AuthResponse)
async def signup(payload: UserSignup):
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = uid()
    doc = {
        "id": user_id,
        "email": payload.email.lower(),
        "name": payload.name,
        "password_hash": hash_password(payload.password),
        "plan": "free",
        "avatar": None,
        "provider": "email",
        "created_at": datetime.utcnow(),
    }
    await db.users.insert_one(doc)
    token = create_access_token(user_id)
    return AuthResponse(user=user_to_public(doc), token=token)


@api_router.post("/auth/login", response_model=AuthResponse)
async def login(payload: UserLogin):
    u = await db.users.find_one({"email": payload.email.lower()})
    if not u or not verify_password(payload.password, u.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(u["id"])
    return AuthResponse(user=user_to_public(u), token=token)


@api_router.post("/auth/google", response_model=AuthResponse)
async def google_auth(payload: GoogleAuthRequest):
    u = await db.users.find_one({"email": payload.email.lower()})
    if not u:
        user_id = uid()
        doc = {
            "id": user_id,
            "email": payload.email.lower(),
            "name": payload.name,
            "password_hash": "",
            "plan": "free",
            "avatar": payload.picture,
            "provider": "google",
            "google_id": payload.google_id,
            "created_at": datetime.utcnow(),
        }
        await db.users.insert_one(doc)
        u = doc
    token = create_access_token(u["id"])
    return AuthResponse(user=user_to_public(u), token=token)


@api_router.get("/auth/me", response_model=UserPublic)
async def me(user_id: str = Depends(get_current_user_id)):
    u = await db.users.find_one({"id": user_id})
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return user_to_public(u)


@api_router.patch("/auth/me/plan")
async def update_plan(plan: str, user_id: str = Depends(get_current_user_id)):
    if plan not in ("free", "pro", "premium"):
        raise HTTPException(status_code=400, detail="Invalid plan")
    await db.users.update_one({"id": user_id}, {"$set": {"plan": plan}})
    u = await db.users.find_one({"id": user_id})
    return user_to_public(u)


# ========== Resumes ==========
@api_router.get("/resumes", response_model=List[Resume])
async def list_resumes(user_id: str = Depends(get_current_user_id)):
    cursor = db.resumes.find({"user_id": user_id}).sort("updated_at", -1)
    items = await cursor.to_list(200)
    result = []
    for r in items:
        r.pop("_id", None)
        result.append(Resume(**r))
    return result


@api_router.post("/resumes", response_model=Resume)
async def create_resume(payload: ResumeCreate, user_id: str = Depends(get_current_user_id)):
    r = Resume(
        user_id=user_id,
        title=payload.title,
        template=payload.template,
        target_role=payload.target_role,
        data=payload.data,
    )
    await db.resumes.insert_one(r.dict())
    return r


@api_router.get("/resumes/{resume_id}", response_model=Resume)
async def get_resume(resume_id: str, user_id: str = Depends(get_current_user_id)):
    r = await db.resumes.find_one({"id": resume_id, "user_id": user_id})
    if not r:
        raise HTTPException(status_code=404, detail="Resume not found")
    r.pop("_id", None)
    return Resume(**r)


@api_router.put("/resumes/{resume_id}", response_model=Resume)
async def update_resume(resume_id: str, payload: ResumeUpdate, user_id: str = Depends(get_current_user_id)):
    update = {k: v for k, v in payload.dict(exclude_none=True).items()}
    update["updated_at"] = datetime.utcnow()
    result = await db.resumes.update_one({"id": resume_id, "user_id": user_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    r = await db.resumes.find_one({"id": resume_id})
    r.pop("_id", None)
    return Resume(**r)


@api_router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str, user_id: str = Depends(get_current_user_id)):
    result = await db.resumes.delete_one({"id": resume_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"deleted": True}


# ========== ATS Analysis ==========
@api_router.post("/ats/analyze")
async def ats_analyze_text(payload: ATSAnalyzeRequest):
    try:
        result = await ai_service.analyze_ats(payload.resume_text, payload.target_role or "")
        return result
    except Exception as e:
        logger.exception("ATS analysis failed")
        raise HTTPException(status_code=500, detail=f"ATS analysis failed: {e}")


@api_router.post("/ats/analyze-file")
async def ats_analyze_file(file: UploadFile = File(...), target_role: Optional[str] = Form(None)):
    text = await extract_text_from_upload(file)
    if len(text.strip()) < 100:
        raise HTTPException(status_code=400, detail="Could not extract sufficient text from resume")
    try:
        result = await ai_service.analyze_ats(text, target_role or "")
        result["filename"] = file.filename
        result["extracted_chars"] = len(text)
        return result
    except Exception as e:
        logger.exception("ATS analysis failed")
        raise HTTPException(status_code=500, detail=f"ATS analysis failed: {e}")


# ========== JD Tailor ==========
@api_router.post("/jd/tailor")
async def jd_tailor(payload: JDTailorRequest):
    if len(payload.jd_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="JD must be at least 50 characters")
    if len(payload.resume_text.strip()) < 100:
        raise HTTPException(status_code=400, detail="Resume text must be at least 100 characters")
    try:
        return await ai_service.tailor_to_jd(payload.resume_text, payload.jd_text)
    except Exception as e:
        logger.exception("JD tailoring failed")
        raise HTTPException(status_code=500, detail=f"JD tailoring failed: {e}")


@api_router.post("/jd/tailor-file")
async def jd_tailor_file(jd_text: str = Form(...), file: UploadFile = File(...)):
    text = await extract_text_from_upload(file)
    if len(jd_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="JD must be at least 50 characters")
    try:
        return await ai_service.tailor_to_jd(text, jd_text)
    except Exception as e:
        logger.exception("JD tailoring failed")
        raise HTTPException(status_code=500, detail=f"JD tailoring failed: {e}")


# ========== AI Content Generation ==========
@api_router.post("/ai/generate", response_model=AIGenerateResponse)
async def ai_generate(payload: AIGenerateRequest):
    try:
        result = await ai_service.generate_content(payload.prompt, payload.context or "", payload.kind)
        return AIGenerateResponse(text=result.get("text", ""), suggestions=result.get("suggestions", []))
    except Exception as e:
        logger.exception("AI generate failed")
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")


# ========== Job Search ==========
@api_router.post("/jobs/search", response_model=JobSearchResponse)
async def search_jobs(payload: JobSearchRequest):
    try:
        raw = await jobs_service.search_jobs(
            search_term=payload.search_term,
            location=payload.location,
            sites=payload.sites,
            hours_old=payload.hours_old,
            is_remote=payload.is_remote,
            results_per_site=payload.results_per_site,
            use_serpapi=payload.use_serpapi,
            resume_skills=payload.resume_skills,
        )
        jobs: List[Job] = []
        for j in raw:
            try:
                jobs.append(Job(**j))
            except Exception:
                continue
        return JobSearchResponse(jobs=jobs, total=len(jobs), search_term=payload.search_term, location=payload.location)
    except Exception as e:
        logger.exception("Job search failed")
        raise HTTPException(status_code=500, detail=f"Job search failed: {e}")


# ========== Saved Jobs ==========
@api_router.post("/jobs/save")
async def save_job(job: Job, user_id: str = Depends(get_current_user_id)):
    doc = job.dict()
    doc["user_id"] = user_id
    doc["saved_at"] = datetime.utcnow()
    await db.saved_jobs.insert_one(doc)
    return {"saved": True, "id": job.id}


@api_router.get("/jobs/saved", response_model=List[Job])
async def get_saved_jobs(user_id: str = Depends(get_current_user_id)):
    cursor = db.saved_jobs.find({"user_id": user_id}).sort("saved_at", -1)
    items = await cursor.to_list(200)
    result = []
    for j in items:
        j.pop("_id", None)
        j.pop("user_id", None)
        j.pop("saved_at", None)
        try:
            result.append(Job(**j))
        except Exception:
            continue
    return result


@api_router.delete("/jobs/saved/{job_id}")
async def unsave_job(job_id: str, user_id: str = Depends(get_current_user_id)):
    await db.saved_jobs.delete_one({"user_id": user_id, "id": job_id})
    return {"deleted": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
