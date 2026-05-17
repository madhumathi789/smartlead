import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">SL</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Smart Leads
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user?.name} —
          <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
            {user?.role}
          </span>
        </span>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <button
          onClick={logout}
          className="text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar