'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardStats from '@/components/admin/DashboardStats'

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link
          href="/admin/dashboard/quotes"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Quote Requests</h3>
          <p className="text-sm text-gray-600">View and manage quote requests</p>
        </Link>
        <Link
          href="/admin/dashboard/inspections"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Vehicle Inspections</h3>
          <p className="text-sm text-gray-600">Manage inspection requests</p>
        </Link>
        <Link
          href="/admin/dashboard/calendar"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Inspection Calendar</h3>
          <p className="text-sm text-gray-600">View inspections on calendar</p>
        </Link>
        <Link
          href="/admin/dashboard/vehicles"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Listed Vehicles</h3>
          <p className="text-sm text-gray-600">View and manage all vehicles</p>
        </Link>
      </div>
    </div>
  )
}

