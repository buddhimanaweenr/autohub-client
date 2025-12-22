'use client'

import { useState, useEffect } from 'react'
import { fetchQuoteRequests, fetchAllVehicles } from '@/lib/admin/api'
import type { QuoteRequestListItem } from '@/lib/admin/api'
import type { Vehicle } from '@/lib/vehicle/types'
import { getMakeLabel } from '@/lib/constants/vehicleMakes'

export default function QuoteRequestsView() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestListItem[]>([])
  const [vehicles, setVehicles] = useState<{ [key: string]: Vehicle }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadQuoteRequests()
  }, [])

  const loadQuoteRequests = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchQuoteRequests()
      setQuoteRequests(data)
      
      // Load vehicle details
      await loadVehicleDetails(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load quote requests')
    } finally {
      setLoading(false)
    }
  }

  const loadVehicleDetails = async (requestsList: QuoteRequestListItem[]) => {
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
        <div className="text-lg text-gray-600">Loading quote requests...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">{error}</div>
        <button
          onClick={loadQuoteRequests}
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
          onClick={loadQuoteRequests}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>

      {quoteRequests.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No quote requests found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {quoteRequests.map((request) => {
              const vehicle = vehicles[request.vehicleId]
              
              return (
                <li key={request._id} className="px-6 py-4">
                  <div className="flex gap-6">
                    {/* Vehicle Details */}
                    <div className="flex-shrink-0">
                      {vehicle ? (
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

                    {/* Quote Request Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.fullName}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span>{' '}
                          <a
                            href={`mailto:${request.emailAddress}`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {request.emailAddress}
                          </a>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span>{' '}
                          {request.phoneNumber ? (
                            <a
                              href={`tel:${request.phoneNumber}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {request.phoneNumber}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        {request.whatsappNumber && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">WhatsApp:</span>{' '}
                            <a
                              href={`https://wa.me/${request.whatsappNumber.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {request.whatsappNumber}
                            </a>
                          </p>
                        )}
                        {request.remarks && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm font-medium text-gray-700 mb-1">Remarks:</p>
                            <p className="text-sm text-gray-600">{request.remarks}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Created: {formatDate(request.createdDateTime)}
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

