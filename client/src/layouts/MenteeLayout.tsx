// src/layouts/MenteeLayout.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import {
  FaBars as RawFaBars,
  FaTimes as RawFaTimes,
  FaSignOutAlt as RawFaSignOutAlt,
  FaUserCircle as RawFaUserCircle,
  FaEdit as RawFaEdit,
} from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';

const FaBars = RawFaBars as unknown as React.FC<IconBaseProps>;
const FaTimes = RawFaTimes as unknown as React.FC<IconBaseProps>;
const FaSignOutAlt = RawFaSignOutAlt as unknown as React.FC<IconBaseProps>;
const FaUserCircle = RawFaUserCircle as unknown as React.FC<IconBaseProps>;
const FaEdit = RawFaEdit as unknown as React.FC<IconBaseProps>;

const MenteeLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mentee, setMentee] = useState<any>(null); // You can later replace 'any' with an interface
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) return;

        const { id } = JSON.parse(storedUser);
        const res = await axios.get(`/auth/profile/${id}`);
        setMentee(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch mentee profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md p-4 transition-all ${collapsed ? 'w-16' : 'w-64'}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-green-600 text-xl mb-4 focus:outline-none"
        >
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>

        {!collapsed && (
          <>
            <div
                className="flex items-center mb-4 cursor-pointer hover:bg-green-50 p-2 rounded"
                onClick={() => navigate('/mentee/dashboard')}
            >
                <FaUserCircle className="text-4xl text-green-600 mr-2" />
                <div>
                    <p className="font-semibold">{mentee?.name || 'Mentee'}</p>
                    <p className="text-xs text-gray-500">{mentee?.email}</p>
                </div>
            </div>

            {/* ✅ Profile Summary */}
            {mentee && (
              <div className="mb-4 text-sm text-gray-600">
                <p><strong>Bio:</strong> {mentee.bio || 'N/A'}</p>
                <p><strong>Skills:</strong> {mentee.skills?.join(', ') || 'N/A'}</p>
                <p><strong>Goals:</strong> {mentee.goals || 'N/A'}</p>
              </div>
            )}

            <nav className="space-y-2 text-sm">
              <button onClick={() => navigate('/mentee/edit-profile')} className="block text-left px-2 py-1 hover:bg-green-100">
                <FaEdit className="inline mr-2" /> Edit Profile
              </button>
              <button onClick={() => navigate('/mentors')} className="block text-left px-2 py-1 hover:bg-green-100">
                View Mentors
              </button>
              <button onClick={() => navigate('/my-requests')} className="block text-left px-2 py-1 hover:bg-green-100">
                My Requests
              </button>
              <button onClick={() => navigate('/my-sessions')} className="block text-left px-2 py-1 hover:bg-green-100">
                My Sessions
              </button>
              <button onClick={handleSignOut} className="block text-left text-red-600 px-2 py-1 hover:bg-red-100 mt-4">
                <FaSignOutAlt className="inline mr-2" /> Sign Out
              </button>
            </nav>
          </>
        )}
      </aside>

      {/* Main content outlet */}
      <main className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-green-50">
        <Outlet />
      </main>
    </div>
  );
};

export default MenteeLayout;