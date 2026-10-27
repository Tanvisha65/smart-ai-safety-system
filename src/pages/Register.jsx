// Register.jsx — redirects to Login which now handles both tabs
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/login', { replace: true }); }, []);
  return null;
}
