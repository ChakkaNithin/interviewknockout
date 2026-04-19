#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Covera.ai
Tests all endpoints according to the review request specifications.
"""

import requests
import json
import time
import random
import string
from typing import Dict, Any, Optional

# Base URL from frontend/.env
BASE_URL = "https://cv-builder-pro-49.preview.emergentagent.com/api"

class CoveraAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.auth_token = None
        self.test_user_email = None
        self.test_resume_id = None
        self.results = []
        
    def log_result(self, test_name: str, success: bool, details: str, response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = self.session.request(method, url, timeout=90, **kwargs)
            return response
        except requests.exceptions.Timeout:
            raise Exception("Request timed out after 90 seconds")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request failed: {e}")
    
    def set_auth_header(self, token: str):
        """Set authorization header for authenticated requests"""
        self.auth_token = token
        self.session.headers.update({"Authorization": f"Bearer {token}"})
    
    def clear_auth_header(self):
        """Clear authorization header but preserve token for later restoration"""
        if "Authorization" in self.session.headers:
            del self.session.headers["Authorization"]
    
    def generate_test_email(self) -> str:
        """Generate unique test email"""
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        return f"test_{random_suffix}@covera.ai"
    
    def test_health_endpoints(self):
        """Test 1: Health and root endpoints"""
        print("\n=== Testing Health Endpoints ===")
        
        # Test root endpoint
        try:
            response = self.make_request("GET", "/")
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "ok":
                    self.log_result("GET /api/", True, f"Status: {response.status_code}, Response: {data}")
                else:
                    self.log_result("GET /api/", False, f"Unexpected response format: {data}")
            else:
                self.log_result("GET /api/", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("GET /api/", False, f"Request failed: {e}")
        
        # Test health endpoint
        try:
            response = self.make_request("GET", "/health")
            if response.status_code == 200:
                data = response.json()
                if "status" in data:
                    self.log_result("GET /api/health", True, f"Status: {response.status_code}, Health: {data}")
                else:
                    self.log_result("GET /api/health", False, f"Missing status field: {data}")
            else:
                self.log_result("GET /api/health", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("GET /api/health", False, f"Request failed: {e}")
    
    def test_auth_flow(self):
        """Test 2: Complete authentication flow"""
        print("\n=== Testing Authentication Flow ===")
        
        # Generate unique test email
        self.test_user_email = self.generate_test_email()
        
        # Test signup
        signup_data = {
            "name": "Test User",
            "email": self.test_user_email,
            "password": "password123"
        }
        
        try:
            response = self.make_request("POST", "/auth/signup", json=signup_data)
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data:
                    self.auth_token = data["token"]
                    self.set_auth_header(self.auth_token)
                    self.log_result("POST /api/auth/signup", True, f"User created successfully, token received")
                else:
                    self.log_result("POST /api/auth/signup", False, f"Missing user or token in response: {data}")
            else:
                self.log_result("POST /api/auth/signup", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/auth/signup", False, f"Request failed: {e}")
        
        # Test duplicate signup (should fail)
        try:
            response = self.make_request("POST", "/auth/signup", json=signup_data)
            if response.status_code == 400:
                data = response.json()
                if "already registered" in data.get("detail", "").lower():
                    self.log_result("POST /api/auth/signup (duplicate)", True, "Correctly rejected duplicate email")
                else:
                    self.log_result("POST /api/auth/signup (duplicate)", False, f"Wrong error message: {data}")
            else:
                self.log_result("POST /api/auth/signup (duplicate)", False, f"Should return 400, got {response.status_code}")
        except Exception as e:
            self.log_result("POST /api/auth/signup (duplicate)", False, f"Request failed: {e}")
        
        # Test login with correct credentials
        login_data = {
            "email": self.test_user_email,
            "password": "password123"
        }
        
        try:
            response = self.make_request("POST", "/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if "token" in data:
                    self.log_result("POST /api/auth/login (correct)", True, "Login successful with correct credentials")
                else:
                    self.log_result("POST /api/auth/login (correct)", False, f"Missing token: {data}")
            else:
                self.log_result("POST /api/auth/login (correct)", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/auth/login (correct)", False, f"Request failed: {e}")
        
        # Test login with wrong password
        wrong_login_data = {
            "email": self.test_user_email,
            "password": "wrongpassword"
        }
        
        try:
            response = self.make_request("POST", "/auth/login", json=wrong_login_data)
            if response.status_code == 401:
                self.log_result("POST /api/auth/login (wrong password)", True, "Correctly rejected wrong password")
            else:
                self.log_result("POST /api/auth/login (wrong password)", False, f"Should return 401, got {response.status_code}")
        except Exception as e:
            self.log_result("POST /api/auth/login (wrong password)", False, f"Request failed: {e}")
        
        # Test /auth/me with token
        if self.auth_token:
            try:
                response = self.make_request("GET", "/auth/me")
                if response.status_code == 200:
                    data = response.json()
                    if "email" in data and data["email"] == self.test_user_email:
                        self.log_result("GET /api/auth/me (with token)", True, f"User profile retrieved: {data['name']}")
                    else:
                        self.log_result("GET /api/auth/me (with token)", False, f"Wrong user data: {data}")
                else:
                    self.log_result("GET /api/auth/me (with token)", False, f"Status: {response.status_code}, Body: {response.text}")
            except Exception as e:
                self.log_result("GET /api/auth/me (with token)", False, f"Request failed: {e}")
        
        # Test /auth/me without token
        self.clear_auth_header()
        try:
            response = self.make_request("GET", "/auth/me")
            if response.status_code == 401:
                self.log_result("GET /api/auth/me (no token)", True, "Correctly rejected request without token")
            else:
                self.log_result("GET /api/auth/me (no token)", False, f"Should return 401, got {response.status_code}")
        except Exception as e:
            self.log_result("GET /api/auth/me (no token)", False, f"Request failed: {e}")
        
        # Restore auth header for subsequent tests
        if self.auth_token:
            self.set_auth_header(self.auth_token)
        
        # Test Google auth (upsert)
        google_data = {
            "email": f"google_{self.generate_test_email()}",
            "name": "Google Test User",
            "google_id": "google123456"
        }
        
        try:
            response = self.make_request("POST", "/auth/google", json=google_data)
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data:
                    self.log_result("POST /api/auth/google", True, "Google auth successful (upsert)")
                else:
                    self.log_result("POST /api/auth/google", False, f"Missing user or token: {data}")
            else:
                self.log_result("POST /api/auth/google", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/auth/google", False, f"Request failed: {e}")
    
    def test_resumes_crud(self):
        """Test 3: Resumes CRUD operations"""
        print("\n=== Testing Resumes CRUD ===")
        
        if not self.auth_token:
            self.log_result("Resumes CRUD", False, "No auth token available, skipping CRUD tests")
            return
        
        # Ensure auth header is set
        self.set_auth_header(self.auth_token)
        
        # Test GET /resumes (should be empty initially)
        try:
            response = self.make_request("GET", "/resumes")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("GET /api/resumes (initial)", True, f"Retrieved {len(data)} resumes")
                else:
                    self.log_result("GET /api/resumes (initial)", False, f"Expected list, got: {type(data)}")
            else:
                self.log_result("GET /api/resumes (initial)", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("GET /api/resumes (initial)", False, f"Request failed: {e}")
        
        # Test POST /resumes (create)
        resume_data = {
            "title": "My Resume",
            "template": "double-column",
            "target_role": "AI Engineer",
            "data": {}
        }
        
        try:
            response = self.make_request("POST", "/resumes", json=resume_data)
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "title" in data:
                    self.test_resume_id = data["id"]
                    self.log_result("POST /api/resumes", True, f"Resume created with ID: {self.test_resume_id}")
                else:
                    self.log_result("POST /api/resumes", False, f"Missing id or title: {data}")
            else:
                self.log_result("POST /api/resumes", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/resumes", False, f"Request failed: {e}")
        
        # Test GET /resumes (should contain created resume)
        try:
            response = self.make_request("GET", "/resumes")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    found_resume = any(r.get("id") == self.test_resume_id for r in data)
                    if found_resume:
                        self.log_result("GET /api/resumes (after create)", True, f"Found created resume in list of {len(data)}")
                    else:
                        self.log_result("GET /api/resumes (after create)", False, "Created resume not found in list")
                else:
                    self.log_result("GET /api/resumes (after create)", False, f"Expected non-empty list, got: {data}")
            else:
                self.log_result("GET /api/resumes (after create)", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("GET /api/resumes (after create)", False, f"Request failed: {e}")
        
        # Test GET /resumes/{id}
        if self.test_resume_id:
            try:
                response = self.make_request("GET", f"/resumes/{self.test_resume_id}")
                if response.status_code == 200:
                    data = response.json()
                    if data.get("id") == self.test_resume_id:
                        self.log_result("GET /api/resumes/{id}", True, f"Retrieved specific resume: {data.get('title')}")
                    else:
                        self.log_result("GET /api/resumes/{id}", False, f"Wrong resume returned: {data}")
                else:
                    self.log_result("GET /api/resumes/{id}", False, f"Status: {response.status_code}, Body: {response.text}")
            except Exception as e:
                self.log_result("GET /api/resumes/{id}", False, f"Request failed: {e}")
        
        # Test PUT /resumes/{id} (update)
        if self.test_resume_id:
            update_data = {
                "title": "Updated Resume"
            }
            
            try:
                response = self.make_request("PUT", f"/resumes/{self.test_resume_id}", json=update_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("title") == "Updated Resume":
                        self.log_result("PUT /api/resumes/{id}", True, "Resume updated successfully")
                    else:
                        self.log_result("PUT /api/resumes/{id}", False, f"Title not updated: {data}")
                else:
                    self.log_result("PUT /api/resumes/{id}", False, f"Status: {response.status_code}, Body: {response.text}")
            except Exception as e:
                self.log_result("PUT /api/resumes/{id}", False, f"Request failed: {e}")
        
        # Test DELETE /resumes/{id}
        if self.test_resume_id:
            try:
                response = self.make_request("DELETE", f"/resumes/{self.test_resume_id}")
                if response.status_code == 200:
                    data = response.json()
                    if data.get("deleted") is True:
                        self.log_result("DELETE /api/resumes/{id}", True, "Resume deleted successfully")
                    else:
                        self.log_result("DELETE /api/resumes/{id}", False, f"Unexpected response: {data}")
                else:
                    self.log_result("DELETE /api/resumes/{id}", False, f"Status: {response.status_code}, Body: {response.text}")
            except Exception as e:
                self.log_result("DELETE /api/resumes/{id}", False, f"Request failed: {e}")
    
    def test_ats_analysis(self):
        """Test 4: ATS Analysis with Claude"""
        print("\n=== Testing ATS Analysis ===")
        
        # Create realistic resume text (300+ chars with required skills)
        resume_text = """
        John Doe
        Senior Software Engineer
        
        EXPERIENCE:
        Software Engineer at TechCorp (2020-2024)
        - Developed scalable web applications using Python and FastAPI
        - Built responsive frontend interfaces with React and TypeScript
        - Deployed applications on AWS using Docker and Kubernetes
        - Implemented CI/CD pipelines and automated testing
        - Collaborated with cross-functional teams in Agile environment
        
        SKILLS:
        Python, React, AWS, FastAPI, Docker, Kubernetes, JavaScript, TypeScript, Git, PostgreSQL
        
        EDUCATION:
        Bachelor of Technology in Computer Science
        """
        
        ats_data = {
            "resume_text": resume_text,
            "target_role": "Software Engineer"
        }
        
        try:
            print("Making ATS analysis request (may take 15-30s)...")
            start_time = time.time()
            response = self.make_request("POST", "/ats/analyze", json=ats_data)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["score", "metrics", "keywords", "missing_keywords", "pros", "cons", "fixes", "verdict"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    score = data.get("score")
                    if isinstance(score, int) and 0 <= score <= 100:
                        self.log_result("POST /api/ats/analyze", True, 
                                      f"ATS analysis successful (score: {score}, duration: {duration:.1f}s)")
                    else:
                        self.log_result("POST /api/ats/analyze", False, f"Invalid score: {score} (should be int 0-100)")
                else:
                    self.log_result("POST /api/ats/analyze", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("POST /api/ats/analyze", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/ats/analyze", False, f"Request failed: {e}")
    
    def test_jd_tailor(self):
        """Test 5: JD Tailoring with Claude"""
        print("\n=== Testing JD Tailoring ===")
        
        # Create realistic resume and JD texts
        resume_text = """
        Jane Smith
        Full Stack Developer
        
        EXPERIENCE:
        Full Stack Developer at StartupXYZ (2021-2024)
        - Built end-to-end web applications using Python, Django, and React
        - Designed and implemented RESTful APIs and microservices
        - Worked with PostgreSQL and Redis for data storage and caching
        - Deployed applications on AWS using EC2, S3, and RDS
        - Implemented automated testing and CI/CD pipelines
        - Collaborated with product managers and designers in Agile sprints
        
        SKILLS:
        Python, React, Django, PostgreSQL, AWS, Docker, Git, JavaScript, HTML, CSS, Redis
        
        EDUCATION:
        Master of Science in Computer Science
        """
        
        jd_text = """
        Software Engineer - Backend Focus
        TechCompany Inc.
        
        We are looking for a skilled Software Engineer to join our backend team.
        
        Requirements:
        - 3+ years experience with Python and FastAPI or Django
        - Strong knowledge of React for frontend development
        - Experience with AWS cloud services (EC2, S3, Lambda)
        - Proficiency in PostgreSQL and database design
        - Knowledge of Docker and containerization
        - Experience with Git version control
        - Understanding of microservices architecture
        - Agile development experience
        
        Nice to have:
        - Experience with Kubernetes
        - Knowledge of Redis caching
        - CI/CD pipeline experience
        """
        
        tailor_data = {
            "resume_text": resume_text,
            "jd_text": jd_text
        }
        
        try:
            print("Making JD tailor request (may take 15-30s)...")
            start_time = time.time()
            response = self.make_request("POST", "/jd/tailor", json=tailor_data)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["match_score", "keywords_added", "keywords_present", "sections_updated", 
                                 "unchanged_sections", "tailored_summary", "tailored_skills", "job_title", "company"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    match_score = data.get("match_score")
                    if isinstance(match_score, int) and 0 <= match_score <= 100:
                        self.log_result("POST /api/jd/tailor", True, 
                                      f"JD tailoring successful (match_score: {match_score}, duration: {duration:.1f}s)")
                    else:
                        self.log_result("POST /api/jd/tailor", False, f"Invalid match_score: {match_score}")
                else:
                    self.log_result("POST /api/jd/tailor", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("POST /api/jd/tailor", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/jd/tailor", False, f"Request failed: {e}")
    
    def test_ai_generate(self):
        """Test 6: AI Content Generation"""
        print("\n=== Testing AI Generation ===")
        
        generate_data = {
            "prompt": "AI Engineer with 5 years Python experience",
            "kind": "summary"
        }
        
        try:
            response = self.make_request("POST", "/ai/generate", json=generate_data)
            if response.status_code == 200:
                data = response.json()
                if "text" in data and "suggestions" in data:
                    text_length = len(data["text"])
                    suggestions_count = len(data["suggestions"])
                    self.log_result("POST /api/ai/generate", True, 
                                  f"AI generation successful (text: {text_length} chars, suggestions: {suggestions_count})")
                else:
                    self.log_result("POST /api/ai/generate", False, f"Missing text or suggestions: {data}")
            else:
                self.log_result("POST /api/ai/generate", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/ai/generate", False, f"Request failed: {e}")
    
    def test_job_search(self):
        """Test 7: Job Search (JobSpy + SerpApi)"""
        print("\n=== Testing Job Search ===")
        
        # Test JobSpy search (without SerpApi)
        jobspy_data = {
            "search_term": "Software Engineer",
            "location": "India",
            "sites": ["indeed", "naukri"],
            "hours_old": 168,
            "results_per_site": 3,
            "use_serpapi": False,
            "resume_skills": ["Python", "React"]
        }
        
        try:
            print("Making JobSpy search request (may take up to 90s)...")
            start_time = time.time()
            response = self.make_request("POST", "/jobs/search", json=jobspy_data)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if "jobs" in data and "total" in data and "search_term" in data and "location" in data:
                    jobs_count = len(data["jobs"])
                    self.log_result("POST /api/jobs/search (JobSpy)", True, 
                                  f"JobSpy search successful ({jobs_count} jobs, duration: {duration:.1f}s)")
                else:
                    self.log_result("POST /api/jobs/search (JobSpy)", False, f"Missing required fields: {data}")
            else:
                self.log_result("POST /api/jobs/search (JobSpy)", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/jobs/search (JobSpy)", False, f"Request failed: {e}")
        
        # Test SerpApi search
        serpapi_data = {
            "search_term": "Software Engineer",
            "location": "India",
            "sites": ["google"],
            "use_serpapi": True,
            "results_per_site": 3,
            "resume_skills": []
        }
        
        try:
            print("Making SerpApi search request...")
            start_time = time.time()
            response = self.make_request("POST", "/jobs/search", json=serpapi_data)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if "jobs" in data and "total" in data:
                    jobs_count = len(data["jobs"])
                    self.log_result("POST /api/jobs/search (SerpApi)", True, 
                                  f"SerpApi search successful ({jobs_count} jobs, duration: {duration:.1f}s)")
                else:
                    self.log_result("POST /api/jobs/search (SerpApi)", False, f"Missing required fields: {data}")
            else:
                self.log_result("POST /api/jobs/search (SerpApi)", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_result("POST /api/jobs/search (SerpApi)", False, f"Request failed: {e}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting Covera.ai Backend API Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        self.test_health_endpoints()
        self.test_auth_flow()
        self.test_resumes_crud()
        self.test_ats_analysis()
        self.test_jd_tailor()
        self.test_ai_generate()
        self.test_job_search()
        
        # Summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        failed = sum(1 for r in self.results if not r["success"])
        
        print(f"Total Tests: {len(self.results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        print(f"\n✅ SUCCESS RATE: {passed}/{len(self.results)} ({passed/len(self.results)*100:.1f}%)")
        
        return self.results

if __name__ == "__main__":
    tester = CoveraAPITester()
    results = tester.run_all_tests()