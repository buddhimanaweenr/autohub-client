'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchAllVehicles, deleteVehicle } from '@/lib/admin/api'
import type { Vehicle } from '@/lib/vehicle/types'
import { getMakeLabel } from '@/lib/constants/vehicleMakes'
import { FaEye, FaEdit, FaTrash, FaPlus, FaCar } from 'react-icons/fa'

interface ListedVehiclesViewProps {
  onEditVehicle?: (vehicle: Vehicle) => void
}

export default function ListedVehiclesView({ onEditVehicle }: ListedVehiclesViewProps) {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchAllVehicles()
      setVehicles(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (vehicle: Vehicle) => {
    if (onEditVehicle) {
      onEditVehicle(vehicle)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    if (onEditVehicle) {
      onEditVehicle(vehicle)
    }
  }

  const handleDelete = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle? This will set it as inactive.')) {
      return
    }

    try {
      setDeletingId(vehicleId)
      await deleteVehicle(vehicleId)
      // Reload vehicles after deletion
      await loadVehicles()
    } catch (err: any) {
      alert(err.message || 'Failed to delete vehicle')
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price: string | number | undefined): string => {
    if (!price) return 'N/A'
    if (typeof price === 'string') return price
    return `$${price.toLocaleString()}`
  }

  const getVehicleImage = (vehicle: Vehicle): string => {
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images[0]
    }
    if (vehicle.image) {
      return vehicle.image
    }
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-gray-600">Loading vehicles...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">{error}</div>
        <button
          onClick={loadVehicles}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-900">Listed Vehicles</h2> */}
          <p className="text-sm text-gray-600 mt-1">
            Total: {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadVehicles}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Refresh
          </button>
          <button
            onClick={() => router.push('/admin/dashboard/vehicles?action=add')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaCar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No vehicles found</p>
          <button
            onClick={() => router.push('/admin/dashboard/vehicles?action=add')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Add your first vehicle
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Make & Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mileage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => {
                  const vehicleId = vehicle._id || vehicle.id?.toString() || ''
                  const isDeleting = deletingId === vehicleId
                  
                  return (
                    <tr key={vehicleId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={getVehicleImage(vehicle)}
                          alt={`${vehicle.make ? getMakeLabel(vehicle.make) : 'Vehicle'} ${vehicle.model || ''}`}
                          className="h-16 w-24 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.make ? getMakeLabel(vehicle.make) : 'N/A'} {vehicle.model || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.transmission || 'N/A'} • {vehicle.fuelType || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.year || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(vehicle.sellingPrice || vehicle.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.mileage ? `${vehicle.mileage} km` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            vehicle.isActive !== false
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {vehicle.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(vehicle)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded"
                            title="View"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicleId)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

