import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from '../../api/axios'; // Axios instance with token interceptor

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'mentor' | 'mentee';
}

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSignout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/admin/users');
        console.log('✅ Users fetched:', res.data); // Debug log
        setUsers(res.data);
      } catch (err: any) {
        const message = err.response?.data?.error || 'Failed to fetch users';
        console.error('❌ Error fetching users:', message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-green-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-green-600 to-blue-600 text-white transition-all duration-300 p-4`}>
        <div className="flex justify-between items-center mb-6">
          {sidebarOpen && <h2 className="font-bold text-xl">Admin Panel</h2>}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="text-white text-xl focus:outline-none"
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>

        <nav className="flex flex-col gap-4 mt-4">
          <Link to="/admin/users" className="hover:underline">Users</Link>
          <Link to="/admin/matches" className="hover:underline">Mentorship Matches</Link>
          <Link to="/admin/sessions" className="hover:underline">Sessions</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleSignout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>

        <Outlet />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* All Users Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 col-span-2">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <table className="min-w-full table-auto text-left text-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Matches Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mentorship Matches</h2>
            <p>Display matches between mentors and mentees here...</p>
          </div>

          {/* Sessions Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sessions Held</h2>
            <p>Show total or detailed list of mentorship sessions here...</p>
          </div>

          {/* Manual Assignment */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Assign Mentor to Mentee</h2>
            <p>Add a form to assign mentor manually here...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

