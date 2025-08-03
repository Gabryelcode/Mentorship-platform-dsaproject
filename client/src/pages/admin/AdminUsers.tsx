import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => navigate('/register')}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-blue-600 transition"
        >
          + Create New User
        </button>
      </div>

      {/* Existing user list or table here */}
    </div>
  );
};

export default AdminUsers;


