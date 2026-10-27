import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = '/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('safety_token'));
  const [loading, setLoading] = useState(true);

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }), [token]);

  useEffect(() => {
    if (token) {
      fetch(`${API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setUser(data); else { setToken(null); localStorage.removeItem('safety_token'); } })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (phone, password) => {
    const r = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, password }) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('safety_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const r = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('safety_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('safety_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const r = await fetch(`${API}/auth/profile`, { method: 'PUT', headers: headers(), body: JSON.stringify(profileData) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Update failed');
    setUser(data);
    return data;
  };

  const apiHeaders = headers;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, apiHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
