import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const MenteeSessions = () => {
  const [acceptedMentors, setAcceptedMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    const fetchAcceptedMentors = async () => {
      try {
        const res = await axios.get('/requests/sent', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const accepted = res.data.filter((req: any) => req.status === 'Accepted');
        setAcceptedMentors(accepted.map((req: any) => req.mentor));
      } catch (err) {
        console.error('Failed to fetch accepted mentors:', err);
      }
    };

    const fetchSessions = async () => {
      try {
        const res = await axios.get('/auth/sessions/mentee', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch sessions:', err);
      }
    };

    fetchAcceptedMentors();
    fetchSessions();
  }, []);

  const handleBookSession = async () => {
    const token = sessionStorage.getItem('token');

    if (!selectedMentor || !sessionDate) {
      alert('Please select a mentor and date.');
      return;
    }

    try {
      await axios.post(
        '/auth/sessions',
        {
          mentorId: selectedMentor,
          date: sessionDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('✅ Session booked successfully!');
      setSelectedMentor('');
      setSessionDate('');
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Booking failed');
      console.error('❌ Booking error:', err);
    }
  };

  const now = new Date();
  const upcomingSessions = sessions.filter((s: any) => new Date(s.date) > now);
  const pastSessions = sessions.filter((s: any) => new Date(s.date) <= now);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">📅 My Mentorship Sessions</h2>

      {/* Booking Section */}
      <div className="mb-8 border-b pb-6">
        <h3 className="text-lg font-semibold mb-2">➕ Book New Session</h3>

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Mentor:</label>
          <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Choose Mentor --</option>
            {acceptedMentors.map((mentor: any) => (
              <option key={mentor._id} value={mentor._id}>
                {mentor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Date & Time:</label>
          <input
            type="datetime-local"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={handleBookSession}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Book Session
        </button>
      </div>

      {/* Upcoming Sessions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">⏳ Upcoming Sessions</h3>
        {upcomingSessions.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming sessions.</p>
        ) : (
          <ul className="space-y-2">
            {upcomingSessions.map((s: any) => (
              <li key={s._id} className="border p-3 rounded">
                <p><strong>Mentor:</strong> {s.mentor?.name}</p>
                <p><strong>Date:</strong> {new Date(s.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Past Sessions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">📁 Past Sessions</h3>
        {pastSessions.length === 0 ? (
          <p className="text-sm text-gray-500">No past sessions yet.</p>
        ) : (
          <ul className="space-y-2">
            {pastSessions.map((s: any) => (
              <li key={s._id} className="border p-3 rounded bg-gray-50">
                <p><strong>Mentor:</strong> {s.mentor?.name}</p>
                <p><strong>Date:</strong> {new Date(s.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MenteeSessions;