import { useState, useEffect } from 'react'
import { useLeads } from '../hooks/useLeads'
import { useDebounce } from '../hooks/useDebounce'
import { useAuth } from '../context/AuthContext'
import type { Lead, LeadFilters } from '../types'
import Navbar from '../components/Navbar'
import FilterBar from '../components/FilterBar'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'
import LeadModal from '../components/LeadModal'

interface DashboardProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

const Dashboard = ({ darkMode, toggleDarkMode }: DashboardProps) => {
  const { user } = useAuth()

  const {
    leads,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    createLead,
    updateLead,
    deleteLead
  } = useLeads()

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch,
      page: 1
    }))
  }, [debouncedSearch, setFilters])

  const handleFilterChange = (
    key: keyof LeadFilters,
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handleReset = () => {
    setSearchInput('')

    setFilters({
      page: 1,
      limit: 10,
      status: '',
      source: '',
      search: '',
      sort: 'latest'
    })
  }

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setModalOpen(true)
  }

  const handleModalSubmit = async (data: Partial<Lead>) => {
    if (editingLead) {
      await updateLead(editingLead._id, data)
    } else {
      await createLead(data)
    }

    setEditingLead(null)
  }

  const handleDelete = async (id: string) => {
    await deleteLead(id)
    setDeleteConfirm(null)
  }

  const exportCSV = () => {
    if (!leads.length) return

    const headers = [
      'Name',
      'Email',
      'Status',
      'Source',
      'Created At'
    ]

    const rows = leads.map(l => [
      l.name,
      l.email,
      l.status,
      l.source,
      new Date(l.createdAt).toLocaleDateString()
    ])

    const csv = [headers, ...rows]
      .map(r => r.join(','))
      .join('\n')

    const blob = new Blob([csv], {
      type: 'text/csv'
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url
    a.download = `leads-${Date.now()}.csv`
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              label: 'Total Leads',
              value: pagination?.total ?? 0,
              color: 'text-blue-600'
            },
            {
              label: 'New',
              value: leads.filter(
                l => l.status === 'New'
              ).length,
              color: 'text-indigo-600'
            },
            {
              label: 'Qualified',
              value: leads.filter(
                l => l.status === 'Qualified'
              ).length,
              color: 'text-green-600'
            },
            {
              label: 'Lost',
              value: leads.filter(
                l => l.status === 'Lost'
              ).length,
              color: 'text-red-500'
            }
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className={`mt-3 text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="border-b border-slate-200 p-6">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

              <h2 className="text-2xl font-bold text-slate-900">
                All Leads
              </h2>

              <div className="flex items-center gap-3">

                <button
                  onClick={exportCSV}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100"
                >
                  Export CSV
                </button>

                <button
                  onClick={() => {
                    setEditingLead(null)
                    setModalOpen(true)
                  }}
                  className="btn-primary"
                >
                  + Add Lead
                </button>

              </div>
            </div>

            <FilterBar
              filters={filters}
              searchValue={searchInput}
              onSearchChange={setSearchInput}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />

          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
            </div>
          ) : error ? (

            /* Error */
            <div className="py-24 text-center text-red-500">
              {error}
            </div>

          ) : leads.length === 0 ? (

            /* Empty */
            <div className="flex flex-col items-center justify-center py-24">

              <p className="text-lg font-medium text-slate-500">
                No leads found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try adjusting filters or create a new lead
              </p>

            </div>

          ) : (

            /* Table */
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    {[
                      'Name',
                      'Email',
                      'Status',
                      'Source',
                      'Created',
                      'Actions'
                    ].map(h => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {h}
                      </th>
                    ))}

                  </tr>

                </thead>

                <tbody>

                  {leads.map(lead => (

                    <tr
                      key={lead._id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {lead.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {lead.email}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {lead.source}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(
                          lead.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          <button
                            onClick={() => handleEdit(lead)}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </button>

                          {user?.role === 'admin' && (

                            deleteConfirm === lead._id ? (

                              <div className="flex items-center gap-2">

                                <button
                                  onClick={() =>
                                    handleDelete(lead._id)
                                  }
                                  className="text-sm font-medium text-red-600 hover:underline"
                                >
                                  Confirm
                                </button>

                                <button
                                  onClick={() =>
                                    setDeleteConfirm(null)
                                  }
                                  className="text-sm text-slate-500 hover:underline"
                                >
                                  Cancel
                                </button>

                              </div>

                            ) : (

                              <button
                                onClick={() =>
                                  setDeleteConfirm(lead._id)
                                }
                                className="text-sm font-medium text-red-500 hover:underline"
                              >
                                Delete
                              </button>

                            )

                          )}

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="border-t border-slate-200">
              <Pagination
                pagination={pagination}
                onPageChange={(page) =>
                  setFilters(prev => ({
                    ...prev,
                    page
                  }))
                }
              />
            </div>
          )}

        </div>
      </main>

      <LeadModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingLead(null)
        }}
        onSubmit={handleModalSubmit}
        lead={editingLead}
      />
    </div>
  )
}

export default Dashboard