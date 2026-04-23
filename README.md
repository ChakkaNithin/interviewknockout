# InterviewKnockout - AI-Powered Resume Builder

> **Formerly known as Covera.ai** - Now rebranded to InterviewKnockout

## ✅ **CURRENT STATUS: RUNNING!**

- ✅ **Backend:** http://localhost:8000 (Running)
- ✅ **Frontend:** http://localhost:3000 (Running)
- ✅ **TheirStack Integration:** Complete
- ✅ **Generic Branding:** No tool names in UI
- ⚠️ **MongoDB:** Not installed (optional for full features)

**Open http://localhost:3000 to use the app!**

---

An AI-powered resume builder with ATS checking, job description tailoring, and intelligent job matching.

## 🚀 Features

- **Resume Builder** - Create professional resumes with 12+ templates
- **ATS Checker** - Analyze resume compatibility with Applicant Tracking Systems
- **JD Tailor** - Automatically adapt resumes to job descriptions
- **Job Search** - AI-powered job search with advanced filters (salary, seniority, company size, funding)
- **AI Content Generation** - Generate summaries, bullet points, and skills
- **Authentication** - Secure JWT-based auth with Google OAuth support

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI + Uvicorn
- **Database:** MongoDB (local or cloud)
- **AI:** Google Gemini 2.0 Flash
- **Job Search:** TheirStack API
- **Auth:** JWT (python-jose) + bcrypt
- **File Processing:** PyPDF2, python-docx
- **HTTP Client:** httpx

### Frontend
- **Framework:** React 19 + React Router v7
- **UI:** Radix UI + Tailwind CSS
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

---

## 📦 Complete Installation Guide

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

---

## Step 1: Install MongoDB (5 minutes)

### Windows Installation

#### Method 1: Download Installer (Recommended)

1. **Download MongoDB Community Edition:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download the `.msi` installer

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (optional GUI tool)

3. **Verify Installation:**
   ```bash
   mongod --version
   ```

4. **Start MongoDB:**
   ```bash
   # If installed as service (automatic)
   net start MongoDB
   
   # Check status
   sc query MongoDB
   ```

#### Method 2: Using Chocolatey
```bash
choco install mongodb
```

### Create Data Directory

MongoDB needs a directory to store data:
```bash
# Create default data directory
mkdir C:\data\db

# Or custom location
mkdir C:\mongodb\data
```

### Test MongoDB Connection

1. **Open new terminal and run:**
   ```bash
   mongosh
   ```

2. **You should see:**
   ```
   Connecting to: mongodb://127.0.0.1:27017
   Using MongoDB: 7.x.x
   ```

3. **Test commands:**
   ```javascript
   // Show databases
   show dbs
   
   // Create/switch to database
   use interviewknockout
   
   // Create a test collection
   db.test.insertOne({name: "test"})
   
   // Exit
   exit
   ```

### MongoDB Compass (Optional GUI)

If you installed MongoDB Compass:
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"
4. Browse databases visually

---

## Step 2: Backend Setup (5 minutes)

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd Cvora.ai/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   
   # You should see (venv) in your terminal
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   *This will take 2-3 minutes*

5. **Verify .env file:**
   The `.env` file is already created with:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=interviewknockout
   GEMINI_API_KEY=AIzaSyCIAaXuZ1_rqaCX3uit_JyZPuVjWQfZ2uY
   JWT_SECRET=your-secret-key-change-in-production
   JWT_ALGORITHM=HS256
   JWT_EXPIRE_MINUTES=10080
   THEIRSTACK_API_KEY=your_theirstack_api_key
   ```

6. **Run backend:**
   ```bash
   uvicorn server:app --reload
   ```
   
   ✅ Backend running on: http://localhost:8000
   
7. **Verify backend:**
   - Open browser: http://localhost:8000
   - You should see: `{"name":"InterviewKnockout API","status":"ok","version":"1.0.0"}`
   - API docs: http://localhost:8000/docs

---

## Step 3: Frontend Setup (3 minutes)

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd Cvora.ai/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
   *This will take 2-3 minutes*

3. **Verify .env file:**
   The `.env` file is already created with:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

4. **Start frontend:**
   ```bash
   npm start
   # or
   yarn start
   ```
   
   ✅ Frontend running on: http://localhost:3000
   
   Browser should auto-open to http://localhost:3000

---

## 🎉 Quick Test (2 minutes)

### Test 1: Create Account
1. Go to http://localhost:3000
2. Click "Build Your Resume" or "Sign Up"
3. Create account:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
4. ✅ You should be redirected to Dashboard

### Test 2: ATS Checker
1. Click "ATS Checker" in navigation
2. Upload a resume (PDF or DOCX)
3. Click "Analyze My Resume"
4. Wait 5-10 seconds
5. ✅ You should see ATS score and analysis

### Test 3: Job Search
1. Click "Job Search" in navigation
2. Fill in your profile
3. Click "Search Jobs Now"
4. Wait 10-15 seconds
5. ✅ You should see job listings

**Note:** Frontend JobSearch.jsx needs manual update to remove tool-specific branding. See "Frontend Update Required" section below.

---

## ⚠️ Frontend Update Required

The `frontend/src/pages/JobSearch.jsx` file needs manual updates to remove tool-specific branding:

### Quick Changes Needed:

1. **Remove site-specific configurations:**
   - Find: `const siteCfg = { linkedin: ..., indeed: ..., naukri: ..., google: ... }`
   - Replace with: `const siteCfg = { job_board: { color: '#4F8EF7', label: 'Job Board', short: 'J', bg: '#EFF6FF' } }`

2. **Update branding text:**
   - Find: `JobSpy + SerpApi` → Replace: `AI-powered search`
   - Find: `Live via JobSpy + SerpApi` → Replace: `Live Results`
   - Find: `Searching Live Jobs` → Replace: `Searching Jobs`

3. **Update API call parameters:**
   - Remove: `sites: ['linkedin', 'indeed', 'naukri', 'google']`
   - Remove: `use_serpapi: true`
   - Remove: `results_per_site: 10`
   - Add: `results_per_page: 25`
   - Add: `easy_apply: filters.easyApply === 'yes' ? true : filters.easyApply === 'no' ? false : null`

4. **Remove site filter buttons:**
   - Find: `const sites = ['all', 'linkedin', 'naukri', 'indeed', 'google']`
   - Replace: `const sites = ['all', 'job_board']`
   - Or remove site filter UI entirely

5. **Remove SourceBadge component usage:**
   - Find: `<SourceBadge site={job.site} />`
   - Remove this line

### Verify No Tool Names in UI:
- ❌ TheirStack
- ❌ Gemini / Google Gemini  
- ❌ JobSpy
- ❌ SerpAPI
- ❌ LinkedIn, Indeed, Naukri, Google (as job sources)

### Use Generic Branding:
- ✅ "AI-Powered Job Search"
- ✅ "AI is analyzing..."
- ✅ "Live Results"
- ✅ "Job Board" (generic site name)

---

## 📝 Daily Development Workflow

### Starting Work:

**Terminal 1 - Backend:**
```bash
cd Cvora.ai/backend
venv\Scripts\activate
uvicorn server:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd Cvora.ai/frontend
npm start
```

### Stopping Work:
- Press `Ctrl+C` in both terminals
- Optionally stop MongoDB: `net stop MongoDB`

---

## 🔧 Useful Commands

### MongoDB Commands
```bash
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Check status
sc query MongoDB

# Connect to MongoDB shell
mongosh

# In mongosh:
show dbs                    # Show databases
use interviewknockout       # Switch to database
show collections            # Show collections
db.users.find()            # Query users
db.resumes.find()          # Query resumes
exit                        # Exit mongosh
```

### Backend Commands
```bash
# Install new package
pip install package-name

# Update requirements
pip freeze > requirements.txt

# Format code
black .

# Lint code
flake8 .
```

### Frontend Commands
```bash
# Install new package
npm install package-name

# Build for production
npm run build

# Run tests
npm test
```

---

## 🔑 API Keys & Configuration

### 1. Google Gemini API Key ✅
- **Status:** Already configured
- **Key:** `AIzaSyCIAaXuZ1_rqaCX3uit_JyZPuVjWQfZ2uY`
- **Location:** `backend/.env`
- **Used for:** ATS analysis, JD tailoring, content generation

### 2. TheirStack API Key ✅
- **Status:** Already configured
- **Key:** Configured in `backend/.env`
- **Location:** `backend/.env` as `THEIRSTACK_API_KEY`
- **Used for:** Job search with advanced filters
- **Get from:** https://theirstack.com/
- **Cost:** 1 API credit per job returned

### TheirStack Features
- Search jobs from thousands of websites
- Advanced filters: salary range, seniority, technologies, company size, funding
- Rich company data: employee count, funding amount, tech stack
- No web scraping - reliable professional API

---

## 🎨 What Changed from Covera.ai

### ✅ AI Provider: Claude → Gemini
- **Before:** Claude Sonnet 4.5 via Emergent Integrations
- **Now:** Google Gemini 2.0 Flash (direct API)
- **Benefits:** Faster, cheaper, simpler integration

### ✅ Job Search: JobSpy + SerpAPI → TheirStack
- **Before:** JobSpy (web scraping) + SerpAPI (Google Jobs)
- **Now:** TheirStack API (professional job search API)
- **Benefits:** 
  - Single reliable API source
  - Advanced filters (salary, seniority, technologies, company size, funding)
  - Rich company data (funding, employee count, tech stack)
  - No scraping issues or rate limits
  - Pay per job returned (1 credit per job)

### ✅ Branding: Covera.ai → InterviewKnockout
- All UI text updated
- Database name changed
- localStorage keys changed (`ik_token`, `ik_user`, `ik_profile`)
- API responses updated
- No tool names visible in UI (generic "AI-powered" branding)

### ✅ Database: MongoDB Local
- Connection: `mongodb://localhost:27017`
- Database name: `interviewknockout`
- Easy to switch to MongoDB Atlas for production

---

## 🐛 Troubleshooting

### ⚠️ Authentication Issues

#### Issue 1: "admin admin" appearing in login form

**Cause:** This is your browser's autofill/password manager, NOT the application code.

**Solutions:**
1. **Clear saved passwords:**
   - Chrome: Settings → Passwords → Search "localhost" → Delete
   - Firefox: Settings → Privacy & Security → Saved Logins → Remove
   - Edge: Settings → Passwords → Search "localhost" → Delete

2. **Disable autofill temporarily:**
   - Right-click the input field → "Clear autofill form"
   - Or use Incognito/Private browsing mode

3. **Browser DevTools:**
   - Press F12 → Application tab → Storage → Clear site data

**Note:** The code has been updated with proper `autoComplete` attributes to help browsers distinguish between login and signup forms.

---

#### Issue 2: Google Login Not Working

**Status:** Google OAuth is currently **disabled** and requires setup.

**Why it's disabled:**
- Google OAuth requires a Client ID from Google Cloud Console
- The previous implementation was a demo that created fake users
- Real Google authentication requires server-side token verification

**To enable Google Login:**

1. **Get Google OAuth Client ID:**
   - Go to: https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable "Google+ API"
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
   - Copy the Client ID

2. **Configure Frontend:**
   - Add to `frontend/.env`:
     ```env
     REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
     ```

3. **Configure Backend:**
   - Add to `backend/.env`:
     ```env
     GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
     ```
   - Install Google auth library:
     ```bash
     pip install google-auth
     ```
   - Uncomment the verification code in `backend/server.py` (line ~110)

4. **Uncomment Frontend Code:**
   - Open `frontend/src/pages/Auth.jsx`
   - Find the `handleGoogle` function (line ~40)
   - Uncomment the Google Identity Services code
   - Remove the error message

**Current behavior:**
- Clicking "Continue with Google" shows: "Google Sign-In requires a Google Client ID to be configured"
- Users must use email/password login instead

---

#### Issue 3: Cannot Create Account / Login Fails

**Cause:** MongoDB is not installed or not running.

**Check MongoDB status:**
```bash
# Windows
sc query MongoDB

# Should show: STATE: 4 RUNNING
```

**If MongoDB is not running:**
```bash
# Start MongoDB service
net start MongoDB

# Verify it's running
sc query MongoDB
```

**If MongoDB is not installed:**
- Follow the "Step 1: Install MongoDB" section in this README
- Installation takes about 5 minutes

**Test MongoDB connection:**
```bash
# Open MongoDB shell
mongosh

# You should see:
# Connecting to: mongodb://127.0.0.1:27017
# Using MongoDB: 7.x.x

# Exit
exit
```

**Backend error messages:**
- `"Connection refused"` → MongoDB not running
- `"Authentication failed"` → Wrong MongoDB credentials
- `"Database not found"` → Normal, will be created automatically

---

#### Issue 4: "Invalid token" or "Session expired"

**Cause:** JWT token expired or localStorage corrupted.

**Solution:**
```javascript
// Open browser console (F12) and run:
localStorage.clear()
// Then refresh the page and login again
```

**Or manually:**
1. Press F12 → Application tab
2. Storage → Local Storage → http://localhost:3000
3. Delete `ik_token` and `ik_user`
4. Refresh page

---

#### Issue 5: Protected Routes Not Working

**Symptoms:**
- Can access ATS Checker, JD Tailor, Job Search without logging in
- No redirect to login page

**Cause:** Authentication context not properly initialized.

**Check:**
1. Open browser console (F12)
2. Look for errors related to AuthContext
3. Verify `ik_token` exists in localStorage after login

**Solution:**
- Clear browser cache and localStorage
- Restart frontend development server
- Try in Incognito mode

---

### MongoDB won't start
```bash
# Check if service exists
sc query MongoDB

# If not found, reinstall MongoDB with "Install as Service" option

# Check port 27017
netstat -ano | findstr :27017
```

### Backend error: "MONGO_URL not found"
```bash
# Make sure you're in backend folder
cd Cvora.ai/backend

# Check if .env exists
dir .env

# If missing, create it with the configuration shown above
```

### Frontend can't connect to backend
```bash
# 1. Make sure backend is running on port 8000
# 2. Check frontend .env has: REACT_APP_BACKEND_URL=http://localhost:8000
# 3. Clear browser cache and reload
# 4. Check browser console for errors (F12)
```

### Port already in use
```bash
# Backend (port 8000)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Frontend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Gemini API errors
- Verify API key is correct in `backend/.env`
- Check internet connection
- Check API quota at: https://aistudio.google.com/

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile phones (320px - 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Laptops (1024px - 1920px)
- 🖥️ Large screens/TVs (1920px+)

All pages use Tailwind CSS responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)

---

## 📊 Database Schema

### Collections

**users**
```javascript
{
  id: string,
  email: string,
  name: string,
  password_hash: string,
  plan: "free" | "pro" | "premium",
  avatar: string | null,
  provider: "email" | "google",
  created_at: datetime
}
```

**resumes**
```javascript
{
  id: string,
  user_id: string,
  title: string,
  template: string,
  target_role: string,
  data: { personal, summary, experiences, education, skills, ... },
  ats_score: int | null,
  created_at: datetime,
  updated_at: datetime
}
```

**saved_jobs**
```javascript
{
  id: string,
  user_id: string,
  title: string,
  company: string,
  location: string,
  job_url: string,
  score: int,
  priority: string,
  saved_at: datetime
}
```

---

## 🔐 Security

- JWT tokens with 7-day expiration
- Bcrypt password hashing
- Bearer token authentication
- CORS enabled (configure for production)
- Environment variables for sensitive data
- **Important:** Change `JWT_SECRET` in production!

---

## 🚀 Production Deployment

### Backend (Railway / Render / Heroku)

1. **Set environment variables:**
   ```env
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/interviewknockout
   DB_NAME=interviewknockout
   GEMINI_API_KEY=your_key
   JWT_SECRET=strong_random_secret_change_this
   THEIRSTACK_API_KEY=your_key
   ```

2. **Deploy:**
   - Connect GitHub repository
   - Set environment variables
   - Deploy

### Frontend (Vercel / Netlify)

1. **Set environment variable:**
   ```env
   REACT_APP_BACKEND_URL=https://your-backend-api.com
   ```

2. **Deploy:**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`

### MongoDB Production

**MongoDB Atlas (Recommended):**
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGO_URL` in production

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

### Resumes
- `GET /api/resumes` - List user resumes
- `POST /api/resumes` - Create resume
- `GET /api/resumes/{id}` - Get resume
- `PUT /api/resumes/{id}` - Update resume
- `DELETE /api/resumes/{id}` - Delete resume

### ATS Analysis
- `POST /api/ats/analyze` - Analyze resume text
- `POST /api/ats/analyze-file` - Analyze uploaded file

### JD Tailoring
- `POST /api/jd/tailor` - Tailor resume to JD
- `POST /api/jd/tailor-file` - Tailor uploaded file

### AI Generation
- `POST /api/ai/generate` - Generate content

### Job Search
- `POST /api/jobs/search` - Search jobs
- `POST /api/jobs/save` - Save job
- `GET /api/jobs/saved` - Get saved jobs
- `DELETE /api/jobs/saved/{id}` - Remove saved job

**Full API Documentation:** http://localhost:8000/docs (when backend is running)

---

## 💡 Tips & Best Practices

- Keep both terminals (backend + frontend) open while developing
- Backend auto-reloads on code changes (`--reload` flag)
- Frontend auto-reloads on code changes (React hot reload)
- Use MongoDB Compass to view database visually
- Check browser console (F12) for frontend errors
- Check terminal for backend errors
- Test on different screen sizes for responsive design

---

## 📄 License

Proprietary - All rights reserved

---

## 🤝 Support

For issues or questions:
1. Check error messages in terminal
2. Check browser console (F12)
3. Verify MongoDB is running: `sc query MongoDB`
4. Verify .env files are configured correctly
5. Clear browser cache and localStorage

---

**Built with ❤️ for job seekers worldwide**

**Domain:** interviewknockout.com
