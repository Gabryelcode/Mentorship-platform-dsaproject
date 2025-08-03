// server/src/routes/auth.ts
import express, { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/User';
import Session from '../models/Session';
import MentorshipRequest from '../models/Request';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    role: string;
  };
}

// ========== REGISTER ==========
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, bio, skills, goals } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      bio: bio || '',
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map(s => s.trim())
        : [],
      goals: goals || '',
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'yoursecretkey',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ========== PROFILE ==========
router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile/:id', async (req, res) => {
  const { name, bio, skills, goals } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, skills, goals },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========== MENTORS ==========
router.get('/mentors', async (_req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('name email skills');
    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

router.get('/mentors/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const user = await User.findById(id).select('name skills');
    if (!user) return res.status(404).json({ error: 'Mentor not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== MENTEE SESSIONS ==========
router.get('/sessions/mentee', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sessions = await Session.find({ mentee: req.user?.id }).populate('mentor');
    res.json(sessions);
  } catch {
    res.status(500).json({ error: 'Failed to fetch mentee sessions' });
  }
});

// ========== BOOK SESSION ==========
router.post('/sessions', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mentorId, date } = req.body;
    if (!mentorId || !date) return res.status(400).json({ error: 'Mentor ID and date are required.' });

    const acceptedRequest = await MentorshipRequest.findOne({
      mentor: mentorId,
      mentee: req.user?.id,
      status: 'Accepted',
    });

    if (!acceptedRequest) return res.status(403).json({ error: 'You are not allowed to book with this mentor.' });

    const newSession = new Session({
      mentor: mentorId,
      mentee: req.user?.id,
      date: new Date(date),
    });

    await newSession.save();
    res.status(201).json({ message: 'Session booked successfully.', session: newSession });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book session.' });
  }
});

// ========== MENTOR SESSIONS ==========
router.get('/sessions/mentor', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'mentor') return res.status(403).json({ error: 'Access denied' });

    const sessions = await Session.find({ mentor: req.user?.id }).populate('mentee');
    res.json(sessions);
  } catch {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
  console.log('Mentor ID:', req.user?.id);

const sessions = await Session.find({ mentor: req.user?.id }).populate('mentee');

console.log('Fetched sessions for mentor:', sessions);

});

router.put('/sessions/:id/status', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  if (!['Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (session.mentor.toString() !== req.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    session.status = status;
    await session.save();
    res.json({ message: `Session ${status.toLowerCase()} successfully`, session });
  } catch {
    res.status(500).json({ error: 'Failed to update session status' });
  }
});

// ========== AVAILABILITY ==========
router.post('/availability', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { slots } = req.body;
    if (!Array.isArray(slots)) return res.status(400).json({ error: 'Slots must be an array of strings' });

    const user = await User.findById(req.user?.id);
    if (!user || user.role !== 'mentor') return res.status(403).json({ error: 'Only mentors can set availability' });

    user.availability = slots;
    await user.save();

    res.json({ message: 'Availability updated', availability: user.availability });
  } catch {
    res.status(500).json({ error: 'Failed to set availability' });
  }
});

router.get('/availability', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user?.id).select('availability');
    if (!user) return res.status(404).json({ error: 'Mentor not found' });

    res.json(user.availability);
  } catch {
    res.status(500).json({ error: 'Failed to get availability' });
  }
  console.log('Fetching availability for mentor:', req.user?.id);

});

export default router;