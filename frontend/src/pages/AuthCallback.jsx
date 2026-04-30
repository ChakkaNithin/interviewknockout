import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let done = false;
    const go = (path) => { if (!done) { done = true; navigate(path, { replace: true }); } };

    // Supabase auto-exchanges the ?code= via PKCE (detectSessionInUrl: true by default).
    // onAuthStateChange fires SIGNED_IN once exchange completes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) go('/dashboard');
      if (event === 'INITIAL_SESSION' && session) go('/dashboard');
    });

    // Timeout: if no auth event in 12s, show specific error
    const timer = setTimeout(async () => {
      if (done) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { go('/dashboard'); return; }
      done = true;
      const hasCode = new URLSearchParams(window.location.search).get('code');
      const hasToken = window.location.hash.includes('access_token');
      if (!hasCode && !hasToken) {
        setError('No sign-in code received from Google. Make sure port 3000 is set to Public in Codespaces (Ports tab → right-click 3000 → Port Visibility → Public), then try again.');
      } else {
        setError('Sign in timed out. Please try again.');
      }
    }, 12000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        {!error && <div className="w-12 h-12 mx-auto mb-5 rounded-full border-4 border-slate-200 border-t-[#0F3D2E] animate-spin" />}
        <h1 className="text-xl font-extrabold text-slate-900 mb-2">Finishing sign in</h1>
        {error ? (
          <>
            <p className="text-sm text-red-600 mb-5 leading-relaxed">{error}</p>
            <Link to="/login" className="text-sm font-bold text-[#0F3D2E] hover:underline">
              Back to sign in
            </Link>
          </>
        ) : (
          <p className="text-sm text-slate-500">Please wait a moment.</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
