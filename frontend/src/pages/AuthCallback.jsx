import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const finishAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        navigate(session ? '/dashboard' : '/login', { replace: true });
      } catch (err) {
        setError(err.message || 'Unable to finish sign in. Please try again.');
      }
    };

    finishAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-5 rounded-full border-4 border-slate-200 border-t-[#0F3D2E] animate-spin"></div>
        <h1 className="text-xl font-extrabold text-slate-900 mb-2">
          Finishing sign in
        </h1>
        {error ? (
          <>
            <p className="text-sm text-red-600 mb-5">{error}</p>
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
