import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await signupApi(form);
      if (!res.data.token) {
        setError(res.data.message || 'Signup failed');
        return;
      }
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      {/* Left-side PDF text block */}
      <div style={{ marginRight: '2rem', maxWidth: '260px' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>G.Assets</h1>
        <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
          One place for Unity, Unreal, Kenney and more.
        </p>

        <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>
          Search across multiple asset stores
        </p>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>
          Upload and manage your own packs
        </p>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>
          Track downloads and usage
        </p>
      </div>

      {/* Existing signup form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {error && <p className="error-text">{error}</p>}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

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

        <button type="submit">Create Account</button>

        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
