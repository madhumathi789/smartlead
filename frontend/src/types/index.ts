export interface User {
    _id: string
    name: string
    email: string
    role: 'admin' | 'sales'
  }
  
  export interface Lead {
    _id: string
    name: string
    email: string
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost'
    source: 'Website' | 'Instagram' | 'Referral'
    createdAt: string
    updatedAt: string
  }
  
  export interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  
  export interface LeadsResponse {
    success: boolean
    data: Lead[]
    pagination: Pagination
  }
  
  export interface AuthResponse {
    success: boolean
    token: string
    data: User
  }
  
  export interface LeadFilters {
    page: number
    limit: number
    status: string
    source: string
    search: string
    sort: 'latest' | 'oldest'
  }