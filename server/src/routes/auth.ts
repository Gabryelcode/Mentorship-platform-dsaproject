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
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

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

    const user = await User.findOne({ email });
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

// ========== TEST ROUTES ==========
router.get('/test', (req, res) => {
  res.send('✅ Auth route is working!');
});

router.get('/test-db', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ========== GET ALL MENTORS ==========
router.get('/mentors', async (req, res) => {
  try {
    console.log('📡 GET /api/auth/mentors called');
    const mentors = await User.find({ role: 'mentor' }).select('name email skills');
    res.status(200).json(mentors);
  } catch (err) {
    console.error('❌ Error fetching mentors:', err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// ========== GET MENTOR BY ID ==========
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
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

// ========== GET USER PROFILE ==========
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
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== GET MENTEE SESSIONS ==========
router.get('/sessions/mentee', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sessions = await Session.find({ mentee: req.user?.id }).populate('mentor');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mentee sessions' });
  }
});

// ========== GET SENT REQUESTS ==========
router.get('/requests/sent', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requests = await MentorshipRequest.find({ mentee: req.user?.id }).populate('mentor');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// PUT /auth/profile/:id
// server/routes/auth.ts or similar

router.put('/profile/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          bio: req.body.bio,
          skills: req.body.skills,
          goals: req.body.goals,
        },
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'User not found' });

    res.json(updated);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
