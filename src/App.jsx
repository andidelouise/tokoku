import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';

// DEBUGGING: Cetak URL Supabase yang sedang digunakan ke konsol
console.log("Aplikasi mencoba terhubung ke:", process.env.REACT_APP_SUPABASE_URL);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Memuat...</div>;
  }

  return (
    <div className="App">
      {!session ? <LoginPage /> : <MainLayout user={session.user} />}
    </div>
  );
}

export default App;
