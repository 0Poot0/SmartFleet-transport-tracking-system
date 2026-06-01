import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import './LoginPage.css';

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://smartfleet-transport-tracking-system.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        loginUser(data.role, data.token);
        if (data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'passenger') {
          navigate('/passenger');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button 
            onClick={() => { setActiveRole('admin'); setError(''); }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer',
              backgroundColor: activeRole === 'admin' ? '#2e7d32' : '#e0e0e0',
              color: activeRole === 'admin' ? 'white' : 'black',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Login as Admin
          </button>
          <button 
            onClick={() => { setActiveRole('passenger'); setError(''); }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer',
              backgroundColor: activeRole === 'passenger' ? '#2e7d32' : '#e0e0e0',
              color: activeRole === 'passenger' ? 'white' : 'black',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Login as Passenger
          </button>
        </div>

        <div className="login-card">
          <h1 className="login-title">{activeRole === 'admin' ? 'Admin Login' : 'Passenger Login'}</h1>
          <p className="login-subtitle">
            {activeRole === 'admin' ? 'Enter your credentials to access the admin panel' : 'Enter your credentials to access the passenger app'}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeRole === 'admin' ? 'admin@example.com' : 'passenger@example.com'}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
