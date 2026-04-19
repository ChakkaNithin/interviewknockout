import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import ATSChecker from './pages/ATSChecker';
import JDTailor from './pages/JDTailor';
import JobSearch from './pages/JobSearch';
import ResumeBuilder from './pages/ResumeBuilder';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/ats-checker" element={<ATSChecker />} />
          <Route path="/jd-tailor" element={<JDTailor />} />
          <Route path="/jobs" element={<JobSearch />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
