import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

interface Mentee {
  _id: string;
  name: string;
  email: string;
  skills?: string[];
  goals?: string;
}

interface Request {
  _id: string;
  mentee: Mentee;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

const MentorRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/requests/received');
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch mentor requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = [...requests];

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    // Filter by search query (mentee name)
    if (searchQuery.trim()) {
      filtered = filtered.filter((r) =>
        r.mentee?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by mentee name
    filtered.sort((a, b) =>
      sortOrder === 'asc'
        ? a.mentee.name.localeCompare(b.mentee.name)
        : b.mentee.name.localeCompare(a.mentee.name)
    );

    setFilteredRequests(filtered);
  }, [requests, filterStatus, searchQuery, sortOrder]);

  const handleDecision = async (requestId: string, decision: 'Accepted' | 'Rejected') => {
    try {
      await axios.patch(`/requests/${requestId}`, { status: decision });
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: decision } : req
        )
      );
    } catch (err) {
      console.error(`❌ Failed to ${decision.toLowerCase()} request:`, err);
      alert('Action failed. Try again.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Mentorship Requests</h1>

      {/* Controls: Status Filter, Search, Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Filter by Status */}
        <div>
          <label className="block font-medium mb-1">Status:</label>
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

        {/* Search by Mentee Name */}
        <div>
          <label className="block font-medium mb-1">Search Mentee:</label>
          <input
            type="text"
            placeholder="Enter name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 border rounded"
          />
        </div>

        {/* Sort Order */}
        <div>
          <label className="block font-medium mb-1">Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-1 border rounded"
          >
            <option value="asc">Name A–Z</option>
            <option value="desc">Name Z–A</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredRequests.length === 0 ? (
        <p>No matching requests found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredRequests.map((req) => (
            <li
              key={req._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{req.mentee?.name}</p>
                <p className="text-sm text-gray-600">{req.mentee?.email}</p>
                <p className="text-sm text-gray-500">
                  Skills: {req.mentee?.skills?.join(', ') || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Goals: {req.mentee?.goals || 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {req.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleDecision(req._id, 'Accepted')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecision(req._id, 'Rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      req.status === 'Accepted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MentorRequests;
