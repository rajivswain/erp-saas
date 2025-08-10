import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  // email/password handled by supabase auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else {
      setMsg('Login successful');
      nav('/dashboard');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message); else setMsg('Signup successful. Check your email.');
  };

  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Login / Signup</h2>
      <form>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: 10 }}>Login</button>
        <button onClick={handleSignup} style={{ width: '100%', padding: 10, marginTop: 8 }}>Signup</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
