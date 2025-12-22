'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchVehicleInspections, fetchAllVehicles } from '@/lib/admin/api'
import type { VehicleInspectionListItem } from '@/lib/admin/api'
import type { Vehicle } from '@/lib/vehicle/types'
import { getMakeLabel } from '@/lib/constants/vehicleMakes'

export default function InspectionCalendarView() {
  const [inspections, setInspections] = useState<VehicleInspectionListItem[]>([])
  const [vehicles, setVehicles] = useState<{ [key: string]: Vehicle }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDate(null)
      }
    }
    if (selectedDate) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedDate])

  useEffect(() => {
    loadInspections()
  }, [])

  const loadInspections = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchVehicleInspections()
      setInspections(data)
      
      // Load vehicle details
      await loadVehicleDetails(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load vehicle inspections')
    } finally {
      setLoading(false)
    }
  }

  const loadVehicleDetails = async (inspectionsList: VehicleInspectionListItem[]) => {
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

  // Group inspections by date
  const inspectionsByDate = useMemo(() => {
    const grouped: { [key: string]: VehicleInspectionListItem[] } = {}
    inspections.forEach((inspection) => {
      if (inspection.preferredDate) {
        // Normalize date to YYYY-MM-DD format
        const dateKey = inspection.preferredDate.split('T')[0]
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(inspection)
      }
    })
    return grouped
  }, [inspections])

  // Get first and last day of current month
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - startDate.getDay()) // Start from Sunday

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: Date[] = []
    const current = new Date(startDate)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return days
  }, [startDate])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return isSameDay(date, today)
  }

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const getInspectionsForDate = (date: Date) => {
    const dateKey = getDateKey(date)
    return inspectionsByDate[dateKey] || []
  }

  const selectedInspections = selectedDate ? getInspectionsForDate(selectedDate) : []

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-gray-600">Loading calendar...</div>
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

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="text-white hover:text-indigo-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-white text-indigo-600 rounded-md hover:bg-indigo-50"
              >
                Today
              </button>
            </div>
            <button
              onClick={goToNextMonth}
              className="text-white hover:text-indigo-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const dateInspections = getInspectionsForDate(date)
              const hasInspections = dateInspections.length > 0
              const isSelected = selectedDate && isSameDay(date, selectedDate)

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(new Date(date))}
                  className={`
                    relative h-20 p-1 text-left border rounded-md transition-colors
                    ${!isCurrentMonth(date) ? 'text-gray-300 bg-gray-50' : 'text-gray-900 bg-white'}
                    ${isToday(date) ? 'ring-2 ring-indigo-500' : ''}
                    ${isSelected ? 'bg-indigo-100 border-indigo-500' : 'border-gray-200 hover:border-indigo-300'}
                    ${hasInspections ? 'font-semibold' : ''}
                  `}
                >
                  <div className="text-sm">{date.getDate()}</div>
                  {hasInspections && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {dateInspections.slice(0, 2).map((inspection) => (
                        <div
                          key={inspection._id}
                          className="w-2 h-2 bg-indigo-500 rounded-full"
                          title={`${inspection.fullName} - ${inspection.preferredTime}`}
                        />
                      ))}
                      {dateInspections.length > 2 && (
                        <div className="text-xs text-indigo-600 font-semibold">
                          +{dateInspections.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Inspection Details Popup Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDate(null)
            }
          }}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-indigo-600 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Inspections on {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  {selectedInspections.length > 0 && (
                    <p className="text-sm text-indigo-100 mt-1">
                      {selectedInspections.length} inspection{selectedInspections.length !== 1 ? 's' : ''} scheduled
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-white hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {selectedInspections.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {selectedInspections.map((inspection) => {
                      const vehicle = vehicles[inspection.vehicleId]
                      
                      return (
                        <li key={inspection._id} className="px-6 py-4">
                          <div className="flex gap-4">
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

                            {/* Inspection Details */}
                            <div className="flex-1">
                              <div className="flex items-center flex-wrap gap-2">
                                <h4 className="text-lg font-medium text-gray-900">
                                  {inspection.fullName}
                                </h4>
                                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                                  {inspection.preferredTime}
                                </span>
                              </div>
                              <div className="mt-3 space-y-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Email:</span>{' '}
                                  <a
                                    href={`mailto:${inspection.emailAddress}`}
                                    className="text-indigo-600 hover:text-indigo-800"
                                  >
                                    {inspection.emailAddress}
                                  </a>
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Phone:</span>{' '}
                                  <a
                                    href={`tel:${inspection.phoneNumber}`}
                                    className="text-indigo-600 hover:text-indigo-800"
                                  >
                                    {inspection.phoneNumber}
                                  </a>
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
                                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Special Requests:</p>
                                    <p className="text-sm text-gray-600">{inspection.specialRequests}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-4 text-gray-600">
                      No inspections scheduled for {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

