// server/src/routes/request.ts
import express, { Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../types/express';
import { authMiddleware } from '../middleware/authMiddleware';
import MentorshipRequest from '../models/Request';

const router = express.Router();

// ✅ POST /requests - Mentee sends request to specific mentor
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { mentorId } = req.body;
  const menteeId = req.user?.id;

  if (!mentorId || !menteeId) {
    return res.status(400).json({ error: 'Mentor ID and mentee ID are required' });
  }

  const existing = await MentorshipRequest.findOne({ mentor: mentorId, mentee: menteeId });
  if (existing) {
    return res.status(400).json({ error: 'Request already exists' });
  }

  const newRequest = new MentorshipRequest({
    mentor: mentorId,
    mentee: menteeId,
    status: 'Pending',
  });

  await newRequest.save();
  res.status(201).json({ message: 'Request sent', request: newRequest });
});

// ✅ GET /requests/sent - Mentee's own requests
router.get('/sent', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requests = await MentorshipRequest.find({ mentee: req.user!.id })
      .populate('mentor', 'name skills email');
    res.json(requests);
  } catch (err) {
    console.error('❌ Error fetching sent requests:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// GET /requests/received - For mentors to view received mentee requests
router.get('/received', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mentorId = req.user?.id;

    if (!mentorId) {
      return res.status(400).json({ error: 'Mentor ID missing in request' });
    }

    const requests = await MentorshipRequest.find({ mentor: mentorId }) // ✅ Only this mentor
      .populate('mentee', 'name email skills goals') // ✅ Get mentee details only
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('❌ Error fetching received requests:', err);
    res.status(500).json({ error: 'Failed to load mentor requests' });
  }
});

// ✅ GET /requests/accepted - Fetch all accepted mentees for logged-in mentor
router.get('/accepted', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const mentorId = req.user?.id;
    if (!mentorId) {
      return res.status(400).json({ error: 'Mentor ID is missing' });
    }

    const accepted = await MentorshipRequest.find({
      mentor: mentorId,
      status: 'Accepted',
    }).populate('mentee', 'name email skills goals'); // populate mentee details

    res.json(accepted);
  } catch (err) {
    console.error('❌ Error fetching accepted mentees:', err);
    res.status(500).json({ error: 'Failed to fetch accepted mentees' });
  }
});


// ✅ DELETE /requests/:id - Mentee cancels own request
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid request ID' });
  }

  try {
    const request = await MentorshipRequest.findById(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (request.mentee.toString() !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this request' });
    }

    await request.deleteOne();
    res.json({ message: 'Request deleted' });
  } catch (err) {
    console.error('❌ Error deleting request:', err);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

// PATCH /requests/:id - Accept or reject a mentorship request
router.patch('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const request = await MentorshipRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.mentor.toString() !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status.toLowerCase()} successfully`, request });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

export default router;