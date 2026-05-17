import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import type { Lead, Pagination, LeadFilters } from '../types'

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    status: '',
    source: '',
    search: '',
    sort: 'latest'
  })

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      )
      const res = await api.get('/leads', { params })
      setLeads(res.data.data)
      setPagination(res.data.pagination)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch leads'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const createLead = async (data: Partial<Lead>) => {
    const res = await api.post('/leads', data)
    fetchLeads()
    return res.data.data
  }

  const updateLead = async (id: string, data: Partial<Lead>) => {
    const res = await api.put(`/leads/${id}`, data)
    fetchLeads()
    return res.data.data
  }

  const deleteLead = async (id: string) => {
    await api.delete(`/leads/${id}`)
    fetchLeads()
  }

  return {
    leads, pagination, loading, error,
    filters, setFilters, fetchLeads,
    createLead, updateLead, deleteLead
  }
}