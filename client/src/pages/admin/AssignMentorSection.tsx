import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignMentorSection = () => {
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedMentee, setSelectedMentee] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch mentors and mentees
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        const users = res.data;

        setMentors(users.filter((u: any) => u.role === 'mentor'));
        setMentees(users.filter((u: any) => u.role === 'mentee'));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleAssign = async () => {
    if (!selectedMentor || !selectedMentee) {
      setMessage('Please select both mentor and mentee');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/assign-mentor', {
        mentorId: selectedMentor,
        menteeId: selectedMentee,
      });

      if (res.status === 200) {
        setMessage('Mentor assigned successfully!');
        setSelectedMentor('');
        setSelectedMentee('');
      }
    } catch (err) {
      setMessage('Failed to assign mentor');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">
      <h3 className="text-xl font-semibold mb-4">Manually Assign Mentor</h3>

      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={selectedMentee}
          onChange={(e) => setSelectedMentee(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Mentee</option>
          {mentees.map((mentee: any) => (
            <option key={mentee._id} value={mentee._id}>
              {mentee.name} ({mentee.email})
            </option>
          ))}
        </select>

        <select
          value={selectedMentor}
          onChange={(e) => setSelectedMentor(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Mentor</option>
          {mentors.map((mentor: any) => (
            <option key={mentor._id} value={mentor._id}>
              {mentor.name} ({mentor.email})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded"
      >
        Assign Mentor
      </button>
    </div>
  );
};

export default AssignMentorSection;
