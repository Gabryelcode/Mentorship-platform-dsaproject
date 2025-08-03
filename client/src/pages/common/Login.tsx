import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

const FaUserIcon = FaIcons.FaUser as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaLockIcon = FaIcons.FaLock as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token, user } = res.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'mentor') {
        navigate('/dashboard');
      } else if (user.role === 'mentee') {
        navigate('/mentee/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        
        {/* ✅ Mentorship Logo (replace with real logo if available) */}
        <div className="mb-4">
          <img
            src="/logo.png" // Replace with your actual logo path
            alt="Mentorship Logo"
            className="w-20 h-20 mx-auto mb-2"
          />
          <h1 className="text-xl font-bold text-green-700">Mentorship Platform</h1>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign in to your account</h2>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <div className="text-gray-400 mr-2">
              <FaUserIcon />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <div className="text-gray-400 mr-2">
              <FaLockIcon />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* ✅ Registration link */}
        <p className="mt-6 text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;