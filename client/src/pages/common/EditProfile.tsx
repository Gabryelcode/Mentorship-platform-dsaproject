// EditProfile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

interface MentorProfile {
  name: string;
  email: string;
  bio?: string;
  skills?: string[];
  goals?: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MentorProfile>({
    name: '',
    email: '',
    bio: '',
    skills: [],
    goals: '',
  });

  const storedUser = sessionStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/auth/profile/${user.id}`);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
          skills: res.data.skills || [],
          goals: res.data.goals || '',
        });
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'skills' ? value.split(',').map((s) => s.trim()) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/auth/profile/${user.id}`, formData);

      const updatedUser = { ...user, name: formData.name };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      sessionStorage.setItem('profileUpdated', 'true'); // ✅ Set flag

      alert('✅ Profile updated successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Failed to update profile:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md max-w-xl">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Full Name"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          className="w-full border px-3 py-2 rounded bg-gray-100"
          disabled
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Bio"
        />
        <input
          name="skills"
          value={formData.skills?.join(', ')}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Skills (comma separated)"
        />
        <input
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Goals"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;