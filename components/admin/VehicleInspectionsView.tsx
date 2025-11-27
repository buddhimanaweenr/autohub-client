'use client'

import { useState, useEffect } from 'react'
import { fetchVehicleInspections } from '@/lib/admin/api'
import type { VehicleInspectionListItem } from '@/lib/admin/api'

export default function VehicleInspectionsView() {
  const [inspections, setInspections] = useState<VehicleInspectionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInspections()
  }, [])

  const loadInspections = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchVehicleInspections()
      setInspections(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load vehicle inspections')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-gray-600">Loading vehicle inspections...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">{error}</div>
        <button
          onClick={loadInspections}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Vehicle Inspection Requests</h2>
        <button
          onClick={loadInspections}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>

      {inspections.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No vehicle inspection requests found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {inspections.map((inspection) => (
              <li key={inspection._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {inspection.fullName}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500">
                        (Vehicle ID: {inspection.vehicleId})
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {inspection.emailAddress}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {inspection.phoneNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Preferred Date:</span> {inspection.preferredDate}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Preferred Time:</span> {inspection.preferredTime}
                      </p>
                      {inspection.inspectionLocation && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Location:</span> {inspection.inspectionLocation}
                        </p>
                      )}
                      {inspection.inspectionType && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span> {inspection.inspectionType}
                        </p>
                      )}
                      {inspection.specialRequests && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Special Requests:</span> {inspection.specialRequests}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Created: {formatDate(inspection.createdDateTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

