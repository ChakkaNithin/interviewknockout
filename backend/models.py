from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid


def uid():
    return str(uuid.uuid4())


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserSignup(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    # Google JWT token from Google Identity Services
    token: str


class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    plan: str = "free"
    avatar: Optional[str] = None
    provider: str = "email"
    created_at: datetime


class AuthResponse(BaseModel):
    user: UserPublic
    token: str
    token_type: str = "bearer"


# Resume
class PersonalInfo(BaseModel):
    name: str = ""
    title: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""


class Experience(BaseModel):
    id: str = Field(default_factory=uid)
    company: str = ""
    role: str = ""
    period: str = ""
    location: str = ""
    bullets: List[str] = Field(default_factory=list)


class Education(BaseModel):
    id: str = Field(default_factory=uid)
    school: str = ""
    degree: str = ""
    period: str = ""
    cgpa: str = ""


class ResumeData(BaseModel):
    personal: PersonalInfo = Field(default_factory=PersonalInfo)
    summary: str = ""
    experiences: List[Experience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    languages: List[Dict[str, str]] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)


class ResumeCreate(BaseModel):
    title: str
    template: str = "double-column"
    target_role: str = ""
    data: ResumeData = Field(default_factory=ResumeData)


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template: Optional[str] = None
    target_role: Optional[str] = None
    data: Optional[ResumeData] = None


class Resume(BaseModel):
    id: str = Field(default_factory=uid)
    user_id: str
    title: str
    template: str
    target_role: str = ""
    data: ResumeData
    ats_score: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ATS
class ATSAnalyzeRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = None


class ATSMetric(BaseModel):
    label: str
    score: int
    color: str


class ATSFix(BaseModel):
    priority: str  # HIGH | MEDIUM | LOW
    section: str
    fix: str


class ATSResult(BaseModel):
    score: int
    metrics: List[ATSMetric]
    keywords: List[str]
    missing_keywords: List[str]
    pros: List[str]
    cons: List[str]
    fixes: List[ATSFix]
    verdict: str


# JD Tailor
class JDTailorRequest(BaseModel):
    resume_text: str
    jd_text: str


class JDSectionChange(BaseModel):
    section: str
    change: str


class JDTailorResult(BaseModel):
    match_score: int
    keywords_added: List[str]
    keywords_present: List[str]
    sections_updated: List[JDSectionChange]
    unchanged_sections: List[str]
    tailored_summary: str
    tailored_skills: List[str]
    job_title: str
    company: str


# AI Gen
class AIGenerateRequest(BaseModel):
    prompt: str
    context: Optional[str] = None
    kind: str = "summary"  # summary | bullet | skills


class AIGenerateResponse(BaseModel):
    text: str
    suggestions: List[str] = Field(default_factory=list)


# Jobs
class JobSearchRequest(BaseModel):
    search_term: str
    location: str = "India"
    hours_old: int = 168
    is_remote: Optional[bool] = None
    results_per_page: int = 25
    resume_skills: List[str] = Field(default_factory=list)
    # Advanced filters
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    seniority_levels: Optional[List[str]] = None  # junior, mid_level, senior, staff, c_level
    technologies: Optional[List[str]] = None
    min_employees: Optional[int] = None
    max_employees: Optional[int] = None
    min_funding: Optional[int] = None
    max_funding: Optional[int] = None
    industries: Optional[List[int]] = None
    company_names: Optional[List[str]] = None
    easy_apply: Optional[bool] = None
    page: int = 0


class Job(BaseModel):
    id: str = Field(default_factory=uid)
    score: int = 0
    priority: str = "FAIR"
    site: str
    title: str
    company: str
    location: str = ""
    job_type: str = ""
    date_posted: str = ""
    is_remote: bool = False
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    currency: str = ""
    skills: List[str] = Field(default_factory=list)
    experience_range: str = ""
    company_rating: float = 0.0
    description: str = ""
    job_url: str = "#"


class JobSearchResponse(BaseModel):
    jobs: List[Job]
    total: int
    search_term: str
    location: str
