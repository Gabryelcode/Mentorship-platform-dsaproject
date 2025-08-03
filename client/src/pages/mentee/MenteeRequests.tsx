// src/pages/mentee/MenteeRequests.tsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

interface Mentor {
  _id: string;
  name: string;
  skills?: string[];
}

interface Request {
  _id: string;
  mentor: Mentor;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

const MenteeRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('/requests/sent');
        setRequests(res.data);
        setFilteredRequests(res.data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (filterStatus === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((req) => req.status === filterStatus)
      );
    }
  }, [filterStatus, requests]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-green-700">My Mentorship Requests</h1>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredRequests.length === 0 ? (
        <p className="text-gray-500">No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredRequests.map((req) => (
            <li
              key={req._id}
              className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{req.mentor.name}</p>
                <p className="text-sm text-gray-600">
                  Skills:{' '}
                  {Array.isArray(req.mentor.skills)
                    ? req.mentor.skills.join(', ')
                    : 'N/A'}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  req.status === 'Accepted'
                    ? 'bg-green-100 text-green-700'
                    : req.status === 'Rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {req.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenteeRequests;