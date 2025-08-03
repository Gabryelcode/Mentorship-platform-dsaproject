import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Home
import Home from './pages/Home';

// Common
import Login from './pages/common/Login';

// Admin
import AdminUsers from './pages/admin/AdminUsers';
import AdminMatches from './pages/admin/AdminMatches';
import AdminSessions from './pages/admin/AdminSessions';
import AdminDashboard from './pages/admin/AdminDashboard';

// Mentor
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorAvailability from './pages/mentor/MentorAvailability';
import MentorRequests from './pages/mentor/MentorRequests';
import MentorSessions from './pages/mentor/MentorSessions';
import AcceptedMentees from './pages/mentor/AcceptedMentee';
import MentorLayout from './layouts/MentorLayout';
import EditMentorProfile from './pages/mentor/EditMentorProfile';

// Mentee
import MenteeDashboard from './pages/mentee/MenteeDashboard';
import MenteeMentors from './pages/mentee/MenteeMentors';
import MenteeRequests from './pages/mentee/MenteeRequests';
import MenteeSessions from './pages/mentee/MenteeSessions';
import EditMenteeProfile from './pages/mentee/EditMenteeProfile';
import MenteeLayout from './layouts/MenteeLayout';

// Register
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Common Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/matches" element={<AdminMatches />} />
        <Route path="/admin/sessions" element={<AdminSessions />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Mentor Layout Routes */}
        <Route element={<MentorLayout />}>
          <Route path="/dashboard" element={<MentorDashboard />} />
          <Route path="/requests" element={<MentorRequests />} />
          <Route path="/sessions" element={<MentorSessions />} />
          <Route path="/accepted-mentees" element={<AcceptedMentees />} />
          <Route path="/availability" element={<MentorAvailability />} />
          <Route path="/mentor/edit-profile" element={<EditMentorProfile />} />
        </Route>

        {/* Mentee Layout Routes */}
        <Route element={<MenteeLayout />}>
        <Route path="/mentee/dashboard" element={<MenteeDashboard />} />
        <Route path="/mentee/edit-profile" element={<EditMenteeProfile />} />
        <Route path="/mentors" element={<MenteeMentors />} />
        <Route path="/my-requests" element={<MenteeRequests />} />
        <Route path="/my-sessions" element={<MenteeSessions />} />
      </Route>
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
