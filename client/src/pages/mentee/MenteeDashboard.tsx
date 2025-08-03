// src/pages/mentee/MenteeDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

interface Mentor {
  _id: string;
  name: string;
  skills?: string[];
  email?: string;
  photo?: string;
}

interface Request {
  _id: string;
  mentor: {
    _id: string;
    name: string;
  };
  status: string;
}

const MenteeDashboard = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [requestedMentorIds, setRequestedMentorIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchMentors();
    fetchRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, sortOrder, mentors]);

  const fetchMentors = async () => {
    try {
      const res = await axios.get('/auth/mentors');
      setMentors(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch mentors:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`/auth/requests/sent`);
      setRequests(res.data);
      setRequestedMentorIds(res.data.map((req: Request) => req.mentor._id));
    } catch (err) {
      console.error('❌ Failed to fetch requests:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...mentors];
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(lower) ||
          mentor.skills?.some((skill) => skill.toLowerCase().includes(lower))
      );
    }

    filtered.sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    setFilteredMentors(filtered);
  };

  const requestMentorship = async (mentorId: string) => {
    try {
      await axios.post('/requests', { mentorId });
      alert('✅ Mentorship request sent!');
      fetchRequests(); // refresh list
    } catch (err: any) {
      console.error('❌ Error sending request:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Request failed');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-green-700">Mentee Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full sm:w-1/2"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="asc">Sort A–Z</option>
          <option value="desc">Sort Z–A</option>
        </select>
      </div>

      {/* Available Mentors */}
      <section className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Available Mentors</h2>
        {filteredMentors.length === 0 ? (
          <p className="text-gray-500">No mentors match your search.</p>
        ) : (
          <ul className="space-y-4">
            {filteredMentors.map((mentor) => (
              <li key={mentor._id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center space-x-4">
                  {mentor.photo ? (
                    <img
                      src={mentor.photo}
                      alt={mentor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                      {mentor.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{mentor.name}</p>
                    <p className="text-sm text-gray-500">
                      Skills: {mentor.skills?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => requestMentorship(mentor._id)}
                  disabled={requestedMentorIds.includes(mentor._id)}
                  className={`px-4 py-1 rounded text-white ${
                    requestedMentorIds.includes(mentor._id)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {requestedMentorIds.includes(mentor._id) ? 'Requested' : 'Request'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Mentorship Requests */}
      <section className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Mentorship Requests</h2>
        <ul className="space-y-2">
          {requests.map((req) => (
            <li key={req._id} className="flex justify-between items-center">
              <span>{req.mentor?.name || 'Unknown Mentor'}</span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  req.status === 'Accepted'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {req.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Book Session */}
      <section className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-3">Book Session</h2>
        <p className="text-gray-600 mb-3">
          You can book sessions with mentors who accepted your request.
        </p>
        <button
          onClick={() => navigate('/my-sessions')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Sessions
        </button>
      </section>
    </div>
  );
};

export default MenteeDashboard;