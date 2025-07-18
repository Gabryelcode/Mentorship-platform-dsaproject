// src/routes/mentor.ts (or inside auth.ts if combined)
import express from 'express';
import User from '../models/User';
import MentorshipRequest from '../models/Request'; // Adjust the import path as necessary
const router = express.Router();

router.get('/mentors', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' });
    res.status(200).json(mentors);
  } catch (err) {
    console.error('Error fetching mentors:', err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// GET /api/mentors/:mentorId/requests
router.get('/:mentorId/requests', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const requests = await MentorshipRequest.find({ mentor: mentorId }).populate('mentee', 'name goal');
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mentorship requests' });
  }
});


export default router;

