import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const Landing      = lazy(() => import('./pages/Landing'));
const Auth         = lazy(() => import('./pages/Auth'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const Pricing      = lazy(() => import('./pages/Pricing'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ATSChecker   = lazy(() => import('./pages/ATSChecker'));
const JDTailor     = lazy(() => import('./pages/JDTailor'));
const JobSearch    = lazy(() => import('./pages/JobSearch'));

const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#0F3D2E] animate-spin" />
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-8">
    <div className="text-8xl font-extrabold text-slate-100 mb-4">404</div>
    <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
    <p className="text-slate-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" className="px-6 py-3 bg-[#FF6B47] text-white rounded-full font-bold hover:bg-[#ff5630] transition-colors">
      Go Home
    </a>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-500 mb-6">An unexpected error occurred. Please refresh the page.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-[#FF6B47] text-white rounded-full font-bold">
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth key="login" mode="login" />} />
        <Route path="/signup" element={<Auth key="signup" mode="signup" />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/builder/:id" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/ats-checker" element={<ProtectedRoute><ATSChecker /></ProtectedRoute>} />
        <Route path="/jd-tailor" element={<ProtectedRoute><JDTailor /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobSearch /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
