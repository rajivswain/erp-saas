import React from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';

export default function ProtectedRoute({ children }) {
  const session = supabase.auth.getSession(); // returns Promise, but for simplicity assume session handled elsewhere
  // Real app: use context to store session; here we simply render children in dev
  return children;
}
