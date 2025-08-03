import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import {
  FaUser as RawFaUser,
  FaCalendarAlt as RawFaCalendarAlt,
  FaUsers as RawFaUsers,
  FaSyncAlt as RawFaSyncAlt,
  FaEdit as RawFaEdit,
} from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';

const FaUser = RawFaUser as unknown as React.FC<IconBaseProps>;
const FaCalendarAlt = RawFaCalendarAlt as unknown as React.FC<IconBaseProps>;
const FaUsers = RawFaUsers as unknown as React.FC<IconBaseProps>;
const FaSyncAlt = RawFaSyncAlt as unknown as React.FC<IconBaseProps>;
const FaEdit = RawFaEdit as unknown as React.FC<IconBaseProps>;

interface MentorProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  skills?: string[];
  goals?: string;
}

interface AcceptedMentee {
  _id: string;
  mentee: {
    _id: string;
    name: string;
    email: string;
    skills?: string[];
    goals?: string;
  };
}

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [acceptedMentees, setAcceptedMentees] = useState<AcceptedMentee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMentor = async (id: string) => {
    try {
      const res = await axios.get(`/auth/profile/${id}`);
      setMentor(res.data);

      // Store updated user for sidebar and other views
      const stored = sessionStorage.getItem('user');
      if (stored) {
        const updatedUser = { ...JSON.parse(stored), ...res.data };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }

      console.log('✅ Mentor profile fetched:', res.data);
    } catch (err) {
      console.error('❌ Error fetching mentor profile:', err);
      setMentor(null);
    }
  };

  const fetchAccepted = async () => {
    try {
      const res = await axios.get('/requests/accepted');
      setAcceptedMentees(res.data);
    } catch (err) {
      console.error('❌ Error fetching accepted mentees:', err);
    }
  };

  const fetchAll = async () => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    if (!user.id) return;

    const shouldRefetch = sessionStorage.getItem('profileUpdated') === 'true';

    if (shouldRefetch) {
      console.log('🔁 Refresh triggered by profile update');
    }

    await Promise.all([fetchMentor(user.id), fetchAccepted(),]);

    if (shouldRefetch) {
      sessionStorage.removeItem('profileUpdated');
    }

    setLoading(false);
  };

  useEffect(() => {
  if (sessionStorage.getItem('profileUpdated') === 'true') {
    console.log('🔁 Profile was recently updated — refreshing dashboard...');
  }

  fetchAll();
}, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchAll();
  };

  const handleEditProfile = () => {
    navigate('/mentor/edit-profile'); // Must match your App.tsx route
  };

  const upcomingSessions = [
    { date: 'July 20', time: '3–4 PM', mentee: 'Jane Doe' },
    { date: 'July 22', time: '1–2 PM', mentee: 'John Smith' },
  ];

  if (loading) {
    return (
      <main className="p-6 text-center text-green-700 text-xl">
        Loading mentor data...
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 space-y-6 bg-gradient-to-r from-green-50 via-white to-green-100">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-green-700">Mentor Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-100"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {/* Profile Summary */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaUser className="text-green-600" /> Profile Summary
          </h2>
          <button
            onClick={handleEditProfile}
            className="flex items-center text-sm text-green-700 hover:underline"
          >
            <FaEdit className="mr-1" /> Edit Profile
          </button>
        </div>
        {mentor ? (
          <>
            <p><strong>Name:</strong> {mentor.name}</p>
            <p><strong>Email:</strong> {mentor.email}</p>
            <p><strong>Bio:</strong> {mentor.bio || 'N/A'}</p>
            <p><strong>Skills:</strong> {mentor.skills?.join(', ') || 'N/A'}</p>
            <p><strong>Goals:</strong> {mentor.goals || 'N/A'}</p>
          </>
        ) : (
          <p className="text-red-600">User profile not found</p>
        )}
      </section>

      {/* Upcoming Sessions */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FaCalendarAlt className="text-green-600" /> Upcoming Sessions
        </h2>
        <ul className="space-y-3">
          {upcomingSessions.map((session, index) => (
            <li key={index} className="border rounded-xl p-4 bg-green-50">
              <p><strong>Date:</strong> {session.date}</p>
              <p><strong>Time:</strong> {session.time}</p>
              <p><strong>Mentee:</strong> {session.mentee}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Accepted Mentees */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FaUsers className="text-green-600" /> Accepted Mentees
        </h2>
        {acceptedMentees.length === 0 ? (
          <p className="text-gray-500">No mentees accepted yet.</p>
        ) : (
          <ul className="space-y-3">
            {acceptedMentees.map(({ mentee }) => (
              <li key={mentee._id} className="border p-4 rounded-xl bg-green-50">
                <p><strong>Name:</strong> {mentee.name}</p>
                <p><strong>Email:</strong> {mentee.email}</p>
                <p><strong>Skills:</strong> {mentee.skills?.join(', ') || 'N/A'}</p>
                <p><strong>Goals:</strong> {mentee.goals || 'N/A'}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default MentorDashboard;