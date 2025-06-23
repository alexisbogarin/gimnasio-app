// src/components/ProtectedRoute.jsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    // Escucha cambios en la autenticación (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  if (!session) {
    // Si no hay sesión, redirige a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si hay sesión, muestra el componente hijo (el panel de admin)
  return children;
}

export default ProtectedRoute;