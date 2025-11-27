'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated, getAdminUser, clearAdminToken } from '@/lib/admin/auth'
import QuoteRequestsView from '@/components/admin/QuoteRequestsView'
import VehicleInspectionsView from '@/components/admin/VehicleInspectionsView'
import InspectionCalendarView from '@/components/admin/InspectionCalendarView'
import AddVehicleView from '@/components/admin/AddVehicleView'

type TabType = 'quotes' | 'inspections' | 'calendar' | 'vehicles'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('quotes')
  const [adminUser, setAdminUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin')
      return
    }

    const user = getAdminUser()
    setAdminUser(user)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    clearAdminToken()
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              {adminUser && (
                <p className="text-sm text-gray-600">
                  Welcome, {adminUser.fullName} ({adminUser.userName})
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`${
                activeTab === 'quotes'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Quote Requests
            </button>
            <button
              onClick={() => setActiveTab('inspections')}
              className={`${
                activeTab === 'inspections'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Vehicle Inspections
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`${
                activeTab === 'calendar'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Inspection Calendar
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`${
                activeTab === 'vehicles'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Add Vehicle
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'quotes' && <QuoteRequestsView />}
          {activeTab === 'inspections' && <VehicleInspectionsView />}
          {activeTab === 'calendar' && <InspectionCalendarView />}
          {activeTab === 'vehicles' && <AddVehicleView />}
        </div>
      </div>
    </div>
  )
}

