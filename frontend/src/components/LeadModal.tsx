import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import type { Lead } from '../types'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Lead>) => Promise<void>
  lead?: Lead | null
}

type LeadFormData = {
  name: string
  email: string
  status: Lead['status']
  source: Lead['source']
}

const LeadModal = ({
  isOpen,
  onClose,
  onSubmit,
  lead
}: LeadModalProps) => {

  const [form, setForm] = useState<LeadFormData>({
    name: '',
    email: '',
    status: 'New',
    source: 'Website'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source
      })
    } else {
      setForm({
        name: '',
        email: '',
        status: 'New',
        source: 'Website'
      })
    }

    setError('')
  }, [lead, isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required')
      return
    }

    setLoading(true)

    try {
      await onSubmit(form)
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <h2 className="text-2xl font-bold text-slate-900">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 transition hover:text-slate-700"
          >
            ×
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              placeholder="Enter full name"
              className="input-field"
            />

          </div>

          {/* Email */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              placeholder="Enter email address"
              className="input-field"
            />

          </div>

          {/* Status */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as Lead['status']
                })
              }
              className="input-field"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>

          </div>

          {/* Source */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Source
            </label>

            <select
              value={form.source}
              onChange={(e) =>
                setForm({
                  ...form,
                  source: e.target.value as Lead['source']
                })
              }
              className="input-field"
            >
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>

          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading
                ? 'Saving...'
                : lead
                  ? 'Update Lead'
                  : 'Create Lead'}
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}

export default LeadModal