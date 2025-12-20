'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  FaFileInvoice, 
  FaCalendarCheck, 
  FaCalendarAlt, 
  FaCar,
  FaHome,
  FaBars,
  FaTimes
} from 'react-icons/fa'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Dashboard',
      icon: FaHome,
      href: '/admin/dashboard',
    },
    {
      name: 'Vehicles',
      icon: FaCar,
      href: '/admin/dashboard/vehicles',
    },
    {
      name: 'Quote Requests',
      icon: FaFileInvoice,
      href: '/admin/dashboard/quotes',
    },
    {
      name: 'Vehicle Inspections',
      icon: FaCalendarCheck,
      href: '/admin/dashboard/inspections',
    },
    {
      name: 'Inspection Calendar',
      icon: FaCalendarAlt,
      href: '/admin/dashboard/calendar',
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <button
              onClick={onToggle}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Close mobile menu on click
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      onToggle()
                    }
                  }}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2025 Admin Panel
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

