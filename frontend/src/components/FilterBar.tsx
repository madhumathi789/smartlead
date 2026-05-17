import type { LeadFilters } from '../types'

interface FilterBarProps {
  filters: LeadFilters
  searchValue: string
  onSearchChange: (value: string) => void
  onFilterChange: (key: keyof LeadFilters, value: string) => void
  onReset: () => void
}

const FilterBar = ({
  filters, searchValue,
  onSearchChange, onFilterChange, onReset
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input-field w-64"
      />

      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="input-field w-36"
      >
        <option value="">All Status</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </select>

      <select
        value={filters.source}
        onChange={(e) => onFilterChange('source', e.target.value)}
        className="input-field w-36"
      >
        <option value="">All Sources</option>
        <option value="Website">Website</option>
        <option value="Instagram">Instagram</option>
        <option value="Referral">Referral</option>
      </select>

      <select
        value={filters.sort}
        onChange={(e) => onFilterChange('sort', e.target.value)}
        className="input-field w-32"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>

      <button
        onClick={onReset}
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
      >
        Reset
      </button>
    </div>
  )
}

export default FilterBar