import { Response, NextFunction } from 'express'
import Lead from '../models/Lead'
import { AuthRequest, PaginationQuery } from '../types'
import { createError } from '../middleware/errorHandler'

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sort = 'latest'
    } = req.query as PaginationQuery

    const filter: Record<string, unknown> = {}

    if (status) filter.status = status
    if (source) filter.source = source
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum
    const sortOrder = sort === 'latest' ? -1 : 1

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter)
    ])

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    })
  } catch (error) {
    next(error)
  }
}

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.create(req.body)
    res.status(201).json({ success: true, data: lead })
  } catch (error) {
    next(error)
  }
}

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) {
      next(createError('Lead not found', 404))
      return
    }
    res.json({ success: true, data: lead })
  } catch (error) {
    next(error)
  }
}

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!lead) {
      next(createError('Lead not found', 404))
      return
    }
    res.json({ success: true, data: lead })
  } catch (error) {
    next(error)
  }
}

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)
    if (!lead) {
      next(createError('Lead not found', 404))
      return
    }
    res.json({ success: true, message: 'Lead deleted successfully' })
  } catch (error) {
    next(error)
  }
}