import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

import {
  FaUser as RawFaUser,
  FaCalendarAlt as RawFaCalendarAlt,
  FaEnvelopeOpenText as RawFaEnvelopeOpenText,
  FaBars as RawFaBars,
  FaTimes as RawFaTimes,
  FaUsers as RawFaUsers,
} from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';

// ✅ Proper icon casting for JSX compatibility
const FaUser = RawFaUser as unknown as React.FC<IconBaseProps>;
const FaCalendarAlt = RawFaCalendarAlt as unknown as React.FC<IconBaseProps>;
const FaEnvelopeOpenText = RawFaEnvelopeOpenText as unknown as React.FC<IconBaseProps>;
const FaBars = RawFaBars as unknown as React.FC<IconBaseProps>;
const FaTimes = RawFaTimes as unknown as React.FC<IconBaseProps>;
const FaUsers = RawFaUsers as unknown as React.FC<IconBaseProps>;

const MentorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mentor, setMentor] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    axios.get(`/auth/profile/${user.id}`)
      .then(res => setMentor(res.data))
      .catch(() => setMentor(null));
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white p-4 shadow-lg transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}>
        <button onClick={() => setCollapsed(!collapsed)} className="text-green-600 text-xl mb-4 focus:outline-none">
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>

        {/* Mentor Info */}
        {!collapsed && mentor && (
          <Link to="/dashboard" className="mb-6 text-center block hover:bg-green-50 rounded-lg p-2 transition">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold">
            {mentor.name.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold mt-2">{mentor.name}</p>
            <p className="text-sm text-gray-600">{mentor.email}</p>
        </Link>
        )}

        {/* Navigation */}
        {!collapsed && (
          <nav className="space-y-3">
            <h2 className="text-xl font-bold text-green-600 mb-2">Mentor</h2>
            <Link to="/requests" className="block px-2 py-1 rounded hover:bg-green-100 text-gray-700">
              <FaEnvelopeOpenText className="inline mr-2" /> Requests
            </Link>
            <Link to="/sessions" className="block px-2 py-1 rounded hover:bg-green-100 text-gray-700">
              <FaCalendarAlt className="inline mr-2" /> Sessions
            </Link>
            <Link to="/accepted-mentees" className="block px-2 py-1 rounded hover:bg-green-100 text-gray-700">
              <FaUsers className="inline mr-2" /> Accepted Mentees
            </Link>
            <Link to="/profile/edit" className="block px-2 py-1 rounded hover:bg-green-100 text-gray-700">
              <FaUser className="inline mr-2" /> Edit Profile
            </Link>
            <button onClick={handleSignOut} className="block w-full text-left px-2 py-1 rounded hover:bg-red-100 text-red-600 mt-4">
              <FaTimes className="inline mr-2" /> Sign Out
            </button>
          </nav>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-green-50">
        <Outlet />
      </main>
    </div>
  );
};

export default MentorLayout;