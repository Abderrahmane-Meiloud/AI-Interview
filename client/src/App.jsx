import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobProfile from './pages/JobProfile';
import Interview from './pages/Interview';
import InterviewResult from './pages/InterviewResult';
import InterviewHistory from './pages/InterviewHistory';
import InterviewDetail from './pages/InterviewDetail';
import Progress from './pages/Progress';
import React from 'react';


function App() {
  return (
    <Routes>
      {/* Public Routes (Redirect to /dashboard if already logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
      </Route>

      {/* Protected Routes (Redirect to /login if not logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/resume"
          element={
            <DashboardLayout>
              <ResumeUpload />
            </DashboardLayout>
          }
        />
        <Route
          path="/job-profile"
          element={
            <DashboardLayout>
              <JobProfile />
            </DashboardLayout>
          }
        />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/interview/:id/result" element={<InterviewResult />} />
        <Route
          path="/history"
          element={
            <DashboardLayout>
              <InterviewHistory />
            </DashboardLayout>
          }
        />
        <Route
          path="/history/:id"
          element={
            <DashboardLayout>
              <InterviewDetail />
            </DashboardLayout>
          }
        />
        <Route
          path="/progress"
          element={
            <DashboardLayout>
              <Progress />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Default Redirection */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
