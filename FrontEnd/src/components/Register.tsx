import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

const Register: React.FC = () => {
  const [user, setUser] = useState(''); const [pass, setPass] = useState(''); const [err, setErr] = useState<string|null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setErr(null);
    try { await register(user, pass); navigate('/login'); } catch (error) { setErr((error as Error).message); }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text" value={user} onChange={e=>setUser(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
        {err&&<p className="text-red-600">{err}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Have account? <Link to="/login">Login</Link></p>
    </div>
  );
};
export default Register;