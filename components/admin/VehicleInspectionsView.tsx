'use client'

import { useState, useEffect } from 'react'
import { fetchVehicleInspections, fetchAllVehicles } from '@/lib/admin/api'
import type { VehicleInspectionListItem } from '@/lib/admin/api'
import type { Vehicle } from '@/lib/vehicle/types'
import { getMakeLabel } from '@/lib/constants/vehicleMakes'

export default function VehicleInspectionsView() {
  const [inspections, setInspections] = useState<VehicleInspectionListItem[]>([])
  const [vehicles, setVehicles] = useState<{ [key: string]: Vehicle }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadingVehicles, setLoadingVehicles] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    loadInspections()
  }, [])

  const loadInspections = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchVehicleInspections()
      setInspections(data)
      
      // Load vehicle details for each inspection
      loadVehicleDetails(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load vehicle inspections')
    } finally {
      setLoading(false)
    }
  }

  const loadVehicleDetails = async (inspectionsList: VehicleInspectionListItem[]) => {
    const vehicleIds = [...new Set(inspectionsList.map(i => i.vehicleId).filter(Boolean))]
    
    // Fetch all vehicles and create a map by ID
    try {
      const allVehicles = await fetchAllVehicles()
      const vehicleMap: { [key: string]: Vehicle } = {}
      
      allVehicles.forEach(vehicle => {
        const id = vehicle._id || vehicle.id?.toString() || ''
        if (id) {
          vehicleMap[id] = vehicle
        }
      })
      
      setVehicles(vehicleMap)
    } catch (err) {
      console.error('Failed to load vehicles:', err)
    }
  }

  const getVehicleImage = (vehicle: Vehicle | undefined): string => {
    if (!vehicle) return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images[0]
    }
    if (vehicle.image) {
      return vehicle.image
    }
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }

  const formatPrice = (price: string | number | undefined): string => {
    if (!price) return 'N/A'
    if (typeof price === 'string') return price
    return `$${price.toLocaleString()}`
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
        <h2 className="text-xl font-semibold text-gray-900"></h2>
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
            {inspections.map((inspection) => {
              const vehicle = vehicles[inspection.vehicleId]
              const isLoadingVehicle = loadingVehicles[inspection.vehicleId]
              
              return (
                <li key={inspection._id} className="px-6 py-4">
                  <div className="flex gap-6">
                    {/* Vehicle Details */}
                    <div className="flex-shrink-0">
                      {isLoadingVehicle ? (
                        <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        </div>
                      ) : vehicle ? (
                        <div className="w-32">
                          <img
                            src={getVehicleImage(vehicle)}
                            alt={`${vehicle.make ? getMakeLabel(vehicle.make) : 'Vehicle'} ${vehicle.model || ''}`}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                            }}
                          />
                          <div className="text-xs">
                            <p className="font-semibold text-gray-900">
                              {vehicle.make ? getMakeLabel(vehicle.make) : 'N/A'} {vehicle.model || ''}
                            </p>
                            {vehicle.year && (
                              <p className="text-gray-600">{vehicle.year}</p>
                            )}
                            <p className="text-indigo-600 font-semibold">
                              {formatPrice(vehicle.sellingPrice || vehicle.price)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-xs text-gray-400 text-center px-2">Vehicle not found</p>
                        </div>
                      )}
                    </div>

                    {/* Inspection Details */}
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {inspection.fullName}
                        </h3>
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
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

