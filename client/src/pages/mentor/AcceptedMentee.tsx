import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

interface Mentee {
  _id: string;
  name: string;
  email: string;
  skills?: string[];
  goals?: string;
}

interface AcceptedRequest {
  _id: string;
  mentee: Mentee;
  status: 'Accepted';
}

const ITEMS_PER_PAGE = 5;

const AcceptedMentees = () => {
  const [accepted, setAccepted] = useState<AcceptedRequest[]>([]);
  const [filtered, setFiltered] = useState<AcceptedRequest[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const res = await axios.get('/requests/accepted');
        setAccepted(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error('❌ Failed to fetch accepted mentees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccepted();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const filteredData = accepted.filter(({ mentee }) =>
      mentee.name.toLowerCase().includes(query) ||
      mentee.skills?.join(', ').toLowerCase().includes(query) ||
      mentee.goals?.toLowerCase().includes(query)
    );
    setFiltered(filteredData);
    setPage(1);
  }, [search, accepted]);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Skills', 'Goals'];
    const rows = filtered.map(({ mentee }) => [
      mentee.name,
      mentee.email,
      mentee.skills?.join(', ') || '',
      mentee.goals || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'accepted_mentees.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Accepted Mentees</h1>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, skills, or goals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 w-full max-w-md border rounded"
      />

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No mentees found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {paginated.map(({ mentee, _id }) => (
              <li key={_id} className="bg-white rounded shadow p-4">
                <p className="font-semibold">{mentee.name}</p>
                <p className="text-sm text-gray-600">{mentee.email}</p>
                <p className="text-sm text-gray-500">
                  Skills: {mentee.skills?.join(', ') || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Goals: {mentee.goals || 'N/A'}
                </p>
                <a
                  href={`mailto:${mentee.email}`}
                  className="mt-2 inline-block text-blue-600 underline text-sm"
                >
                  Email Mentee
                </a>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-green-700 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AcceptedMentees;