import { Request } from 'express'

export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'sales'
  createdAt: Date
}

export interface ILead {
  _id: string
  name: string
  email: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost'
  source: 'Website' | 'Instagram' | 'Referral'
  createdAt: Date
  updatedAt: Date
}

export interface AuthRequest extends Request {
  user?: IUser
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationQuery {
  page?: string
  limit?: string
  status?: string
  source?: string
  search?: string
  sort?: 'latest' | 'oldest'
}