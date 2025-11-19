import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const validate = () => {
    if (!form.email.trim()) return 'Email required';
    if (!form.email.includes('@')) return 'Invalid email';
    if (!form.password.trim()) return 'Password required';
    if (form.password.length < 6) return 'Minimum 6 characters';
    return '';
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    try {
      const res = await loginApi(form);
      if (!res.data.token) {
        setError(res.data.message || 'Login failed');
        return;
      }
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div style={{ marginRight: '2rem', maxWidth: '260px' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>G.Assets</h1>
        <p style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          One place for Unity, Unreal, Kenney and more.
        </p>
        <ul style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
          <li>Search across multiple asset stores</li>
          <li>Upload and manage your own packs</li>
          <li>Track downloads and usage</li>
        </ul>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="error-text">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Sign In</button>

        <p>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
