import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    bio: '',
    skills: '',
    goals: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, role, bio, skills, goals } = formData;

    if (!fullName || !email || !password || !confirmPassword || !role) {
      return setError('All required fields must be filled.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: fullName,
      email,
      password,
      role,
      bio: formData.bio,
      goals: formData.goals,
      skills: formData.skills.split(',').map(skill => skill.trim()),
    });


      if (response.status === 201) {
        setSuccess('User created successfully!');
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: '',
          bio: '',
          skills: '',
          goals: '',
        });
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error || 'Failed to create user. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New User</h2>

        {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}
        {success && <p className="mb-4 text-green-600 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
            <option value="mentee">Mentee</option>
          </select>

          {/* Optional Profile Fields */}
          <textarea
            name="bio"
            placeholder="Short Bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma-separated)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            name="goals"
            placeholder="Your learning goals"
            value={formData.goals}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600"
          >
            Register User
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:underline font-semibold">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;