// server/src/routes/mentee.ts
import express from 'express';
import User from '../models/User';
import RequestModel from '../models/Request';

const router = express.Router();

// Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' });
    res.status(200).json(mentors);
  } catch (err) {
    console.error('Error fetching mentors:', err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// GET /api/requests/:menteeId
router.get('/requests/:menteeId', async (req, res) => {
  try {
    const { menteeId } = req.params;
    const requests = await RequestModel.find({ mentee: req.params.menteeId })
  .populate('mentor', 'name skills');
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});


export default router;
