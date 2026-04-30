import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let done = false;
    const go = (path) => { if (!done) { done = true; navigate(path, { replace: true }); } };

    const finishAuth = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');

        if (!code) {
          // No code in URL — Supabase redirect was rejected or port is private
          const { data: { session } } = await supabase.auth.getSession();
          if (session) { go('/dashboard'); return; }
          setError('No sign-in code received. This usually means port 3000 is set to Private in Codespaces, or the redirect URL is not in Supabase allowlist. Set port 3000 to Public and try again.');
          return;
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) { go('/dashboard'); return; }
        setError('Sign in completed but session could not be established. Please try again.');
      } catch (err) {
        setError(err.message || 'Unable to finish sign in. Please try again.');
      }
    };

    finishAuth();
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
