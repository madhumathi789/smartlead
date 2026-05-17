import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { AuthRequest } from '../types'
import { createError } from './errorHandler'

interface JwtPayload {
  id: string
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(createError('Not authorized, no token', 401))
      return
    }

    const token = authHeader.split(' ')[1]
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      next(createError('JWT secret not configured', 500))
      return
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      next(createError('User not found', 404))
      return
    }

    req.user = user as any
    next()
  } catch {
    next(createError('Invalid token', 401))
  }
}

export const adminOnly = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    next(createError('Admin access required', 403))
    return
  }
  next()
}