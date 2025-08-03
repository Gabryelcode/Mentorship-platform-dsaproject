import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Availability {
  date: string;
  time: string;
  _id?: string;
}

const MentorAvailability = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const res = await axios.get('http://localhost:5000/api/mentor/availability', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAvailability(res.data);
      } catch (err) {
        console.error('Failed to fetch availability', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mentor Availability</h1>
        <div className="space-x-4">
          <Link to="/profile/edit" className="text-blue-600 hover:underline">Edit Profile</Link>
          <Link to="/requests" className="text-blue-600 hover:underline">Requests</Link>
          <Link to="/sessions" className="text-blue-600 hover:underline">Sessions</Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        {loading ? (
          <p>Loading availability...</p>
        ) : availability.length > 0 ? (
          <ul className="space-y-3">
            {availability.map((slot, index) => (
              <li
                key={slot._id || index}
                className="p-4 border border-gray-200 rounded-lg shadow-sm"
              >
                <p><strong>Date:</strong> {slot.date}</p>
                <p><strong>Time:</strong> {slot.time}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No available slots found.</p>
        )}
      </div>
    </div>
  );
};

export default MentorAvailability;
