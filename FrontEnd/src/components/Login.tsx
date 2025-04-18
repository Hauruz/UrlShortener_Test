import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const [user, setUser] = useState(''); const [pass, setPass] = useState(''); const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setErr(null);
    try { await login(user, pass); navigate('/urls'); } catch (error) { setErr((error as Error).message); }
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text" value={user} onChange={e => setUser(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} required />
        {err && <p className="text-red-600">{err}</p>}
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};
export default Login;