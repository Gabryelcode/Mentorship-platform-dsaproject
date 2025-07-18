// server/src/routes/admin.ts
import express, { Response } from 'express';
import User from '../models/User';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * GET /api/admin/users
 * Fetch all users — only accessible by admin users
 */
router.get('/users', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  console.log('💡 [ADMIN ROUTE HIT] - /api/admin/users');

  try {
    if (!req.user || req.user.role !== 'admin') {
      console.warn('🚫 Access denied: Not an admin');
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find().select('-password'); // exclude password field
    console.log(`✅ Admin fetched ${users.length} user(s)`);
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Admin route error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
