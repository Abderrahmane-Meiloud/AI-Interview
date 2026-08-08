# AI Interview Coach

A production-style full-stack web application that provides personalized AI-powered mock interviews based on your resume and target job role.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| AI | Google Gemini API |
| Resume Parsing | PDF/DOCX text extraction |
| Charts | Recharts |

---

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Gemini API Key** — get one at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Project Structure

```
interview_coach/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── layouts/           # Dashboard layout with sidebar
│   │   ├── services/          # API client (axios)
│   │   ├── context/           # Auth context
│   │   └── utils/
│   ├── index.html
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── controllers/           # Route handlers
│   ├── routes/                # API route definitions
│   ├── models/                # Mongoose schemas
│   ├── middleware/            # Auth, upload, error handling
│   ├── services/
│   │   ├── aiService.js       # Gemini AI prompts & calls
│   │   └── resumeParser.js    # PDF/DOCX extraction
│   ├── utils/                 # Helpers (JSON parsing, async handler)
│   ├── config/                # Database connection
│   ├── app.js
│   └── server.js
│
├── package.json               # Root scripts
└── README.md
```

---

## Setup Instructions

### 1. Clone and Install

```bash
cd interview_coach
npm run install:all
```

Or install separately:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment Variables

Create `server/.env` from the example:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/interview_coach
JWT_SECRET=your_super_secret_jwt_key_change_this
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start MongoDB

**Local MongoDB:**

```bash
# Windows (if installed as service, it may already be running)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas:**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Set `MONGO_URI` in `.env`:
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/interview_coach
   ```

### 4. Run the Application

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## User Flow

1. **Sign Up / Login** → JWT authentication
2. **Upload Resume** → AI extracts skills, projects, experience
3. **Set Job Profile** → Target role, experience level, package
4. **Start Interview** → AI generates 10 personalized questions
5. **Answer Questions** → AI evaluates each answer in real time
6. **View Results** → Detailed scores, feedback, 7-day improvement plan
7. **Track Progress** → Charts showing score trends over time

---

## API Documentation

All protected routes require header: `Authorization: Bearer <token>`

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{ name, email, password }` | Create account |
| POST | `/api/auth/login` | `{ email, password }` | Login, returns JWT |
| GET | `/api/auth/me` | — | Get current user |

### Resume

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/resume/upload` | `FormData: resume (file)` | Upload & analyze resume |
| GET | `/api/resume` | — | Get parsed resume data |

### Job Profile

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/job-profile` | `{ jobRole, experienceLevel, expectedPackage }` | Save job profile |
| GET | `/api/job-profile` | — | Get job profile |

### Interview

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/interview/start` | — | Start new interview |
| GET | `/api/interview/:id/current` | — | Get current question |
| POST | `/api/interview/:id/answer` | `{ answer }` | Submit answer, get evaluation |
| POST | `/api/interview/:id/complete` | — | Complete & get final results |
| GET | `/api/interview/history` | — | List past interviews |
| GET | `/api/interview/:id` | — | Get interview details |

### Dashboard & Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard overview data |
| GET | `/api/dashboard/progress` | Progress tracking data |

---

## AI Flow Architecture

The AI logic lives in `server/services/aiService.js` with five dedicated prompts:

```
┌─────────────────┐
│  Resume Upload  │
└────────┬────────┘
         ▼
┌─────────────────┐     Prompt 1: Resume Analysis
│  Extract Text   │ ──► Parse skills, projects, experience
│  (PDF/DOCX)     │     Return structured JSON
└────────┬────────┘
         ▼
┌─────────────────┐     Prompt 2: Interview Generation
│  Start Interview│ ──► Input: resume + job profile + past weaknesses
│                 │     Output: 10 personalized questions
└────────┬────────┘
         ▼
┌─────────────────┐     Prompt 3: Answer Evaluation
│  Submit Answer  │ ──► Score: correctness, technical, communication
│                 │     Adaptive: adjust next question difficulty
└────────┬────────┘
         ▼
┌─────────────────┐     Prompt 4: Final Evaluation
│  Complete       │ ──► Category scores, strengths, improvements
│  Interview      │
└────────┬────────┘
         ▼
┌─────────────────┐     Prompt 5: Improvement Plan
│  Result Page    │ ──► 7-day personalized study plan
└─────────────────┘
```

### Personalization Logic

Questions are tailored using:

- **Resume data** — skills, projects, experience mentioned
- **Target role** — Full Stack vs Frontend vs Backend
- **Experience level** — Fresher vs Senior (affects difficulty)
- **Expected package** — higher package = harder DSA questions
- **Previous weaknesses** — areas from last interview are prioritized

### JSON Safety

All AI responses are parsed through `utils/parseJSON.js` which:
- Strips markdown code fences
- Extracts JSON from mixed text
- Throws clear errors on malformed responses

---

## Postman Testing

Import these endpoints into Postman:

1. **Register** → `POST http://localhost:5000/api/auth/register`
2. Copy the `token` from response
3. Set collection variable `token` = copied value
4. Add header to all requests: `Authorization: Bearer {{token}}`
5. Test resume upload with form-data key `resume` (file type)
6. Create job profile, then start interview

---

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication (30-day expiry)
- Protected API routes via middleware
- Gemini API key stored server-side only
- File type validation (PDF/DOCX only)
- File size limit (5MB)
- Request body validation
- Centralized error handling

---

## npm Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | server/ | Start backend with nodemon |
| `npm start` | server/ | Start backend (production) |
| `npm run dev` | client/ | Start Vite dev server |
| `npm run build` | client/ | Build for production |
| `npm run install:all` | root/ | Install all dependencies |

---

## License

MIT
