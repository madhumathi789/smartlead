import type  { Lead } from '../types'

const colors: Record<Lead['status'], string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
}

const StatusBadge = ({ status }: { status: Lead['status'] }) => (
  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[status]}`}>
    {status}
  </span>
)

export default StatusBadge