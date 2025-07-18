import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided or format invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yoursecretkey') as {
      userId: string;
      role: string;
    };

    req.user = { id: decoded.userId, role: decoded.role };

    // ✅ Debugging output
    console.log('✅ Authenticated user:', req.user);

    next();
  } catch (err) {
    console.error('❌ Invalid token:', err);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

