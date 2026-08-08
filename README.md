# 🤖 AI Interview Coach

AI Interview Coach is a full-stack MERN application that helps users prepare for technical interviews using Artificial Intelligence.

The platform analyzes a user's resume, target job role, experience level, and expected package to generate a personalized interview. AI evaluates the user's answers, provides scores, identifies weak areas, and suggests ways to improve.

## 🚀 Features

- 🔐 User Authentication with JWT
- 📄 Resume Upload & Analysis
- 💼 Target Job Role Selection
- 💰 Expected Package Selection
- 🤖 AI-Generated Interview Questions
- 🧠 Resume-Based Technical Questions
- 💻 DSA & Problem-Solving Questions
- 👨‍💼 HR & Behavioral Questions
- 📊 AI-Based Answer Evaluation
- 🎯 Overall Interview Score
- 📈 Performance Analysis
- ⚠️ Areas to Improve
- 📚 Personalized Improvement Suggestions
- 🕒 Interview History & Progress Tracking
- 📱 Responsive Dashboard

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcrypt

### AI
- Gemini API

## 🔄 Application Flow

```text
Sign Up / Login
      ↓
Upload Resume
      ↓
AI Resume Analysis
      ↓
Select Job Role + Experience + Package
      ↓
AI Generates Personalized Interview
      ↓
User Answers Questions
      ↓
AI Evaluates Answers
      ↓
Score + Feedback
      ↓
Areas to Improve
      ↓
Personalized Improvement Plan
📊 Performance Evaluation

The AI evaluates candidates on multiple parameters:

Technical Knowledge
DSA & Problem Solving
Communication
Resume Knowledge
Project Understanding
HR / Behavioral Skills

Example:

Overall Score       78/100
Technical           82%
DSA                 71%
Communication       74%
Problem Solving     80%
Resume Knowledge    86%
⚙️ Installation

Clone the repository:

git clone <your-repository-url>
cd ai-interview-coach

Install dependencies:

npm run install:all
🔑 Environment Variables

Create a .env file inside the server directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
▶️ Run the Project
Backend
cd server
npm run dev
Frontend

Open another terminal:

cd client
npm run dev

The frontend will run on the Vite development server.

📁 Project Structure
AI-Interview-Coach/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       └── utils/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── server.js
│
└── README.md
🔮 Future Improvements
🎙️ Voice-based AI interviews
📹 Video interview mode
🧑‍💼 Real-time AI interviewer
💻 Integrated coding environment
📄 ATS resume score
📧 Interview performance reports
📊 Advanced progress analytics
🎯 Goal

The goal of AI Interview Coach is to provide candidates with a personalized AI-powered interview experience and help them identify and improve their weaknesses before facing real interviews.

⭐ If you find this project useful, consider giving it a star!
