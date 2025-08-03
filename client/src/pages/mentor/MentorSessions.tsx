import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const MentorSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');

  const token = sessionStorage.getItem('token');

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/auth/sessions/mentor', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch sessions:', err);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await axios.get('/api/auth/availability', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailability(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch availability:', err);
    }
  };

  const handleStatusUpdate = async (sessionId: string, newStatus: string) => {
    try {
      await axios.put(
        `/api/auth/sessions/${sessionId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSessions(); // Refresh
    } catch (err) {
      alert('Failed to update status');
      console.error('❌ Status update error:', err);
    }
  };

  const addAvailabilitySlot = async () => {
    try {
      const updated = [...availability, newSlot];
      await axios.post(
        '/api/auth/availability',
        { slots: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSlot('');
      fetchAvailability();
    } catch (err) {
      console.error('❌ Failed to add slot:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchAvailability();
  }, []);

  const pending = sessions.filter((s: any) => s.status === 'Pending');
  const accepted = sessions.filter((s: any) => s.status === 'Accepted');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">📋 Mentorship Sessions</h2>

      {/* Pending Requests */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">🕒 Pending Requests</h3>
        {pending.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((s: any) => (
              <li key={s._id} className="border p-4 rounded">
                <p><strong>Mentee:</strong> {s.mentee?.name}</p>
                <p><strong>Date:</strong> {new Date(s.date).toLocaleString()}</p>
                <div className="space-x-2 mt-2">
                  <button
                    onClick={() => handleStatusUpdate(s._id, 'Accepted')}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(s._id, 'Rejected')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Accepted Sessions */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3">✅ Upcoming Accepted Sessions</h3>
        {accepted.length === 0 ? (
          <p>No accepted sessions yet.</p>
        ) : (
          <ul className="space-y-3">
            {accepted.map((s: any) => (
              <li key={s._id} className="border p-4 rounded bg-gray-50">
                <p><strong>Mentee:</strong> {s.mentee?.name}</p>
                <p><strong>Date:</strong> {new Date(s.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mentor Availability Section */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">📅 Set Availability Slots</h3>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="datetime-local"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={addAvailabilitySlot}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Slot
          </button>
        </div>

        {availability.length === 0 ? (
          <p className="text-gray-500 text-sm">No availability slots set yet.</p>
        ) : (
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            {availability.map((slot, i) => (
              <li key={i}>{new Date(slot).toLocaleString()}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MentorSessions;