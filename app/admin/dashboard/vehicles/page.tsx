'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import ListedVehiclesView from '@/components/admin/ListedVehiclesView'
import AddVehicleView from '@/components/admin/AddVehicleView'
import { fetchVehicleByIdAdmin } from '@/lib/admin/api'
import type { Vehicle } from '@/lib/vehicle/types'

export default function VehiclesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list')
  const [loadingVehicle, setLoadingVehicle] = useState(false)

  useEffect(() => {
    const action = searchParams.get('action')
    const vehicleId = searchParams.get('id')
    
    if (action === 'add') {
      setView('add')
      setEditingVehicle(null)
    } else if (action === 'edit' && vehicleId) {
      setView('edit')
      loadVehicleForEdit(vehicleId)
    } else {
      setView('list')
      setEditingVehicle(null)
    }
  }, [searchParams])

  const loadVehicleForEdit = async (vehicleId: string) => {
    try {
      setLoadingVehicle(true)
      const vehicle = await fetchVehicleByIdAdmin(vehicleId)
      setEditingVehicle(vehicle)
    } catch (error: any) {
      console.error('Failed to load vehicle:', error)
      alert(error.message || 'Failed to load vehicle details')
      router.push('/admin/dashboard/vehicles')
    } finally {
      setLoadingVehicle(false)
    }
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setView('edit')
    router.push(`/admin/dashboard/vehicles?action=edit&id=${vehicle._id || vehicle.id}`)
  }

  const handleVehicleSuccess = () => {
    setEditingVehicle(null)
    router.push('/admin/dashboard/vehicles')
  }

  if (view === 'add' || view === 'edit') {
    if (view === 'edit' && loadingVehicle) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      )
    }

    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
          </h1>
          <p className="text-gray-600">
            {editingVehicle ? 'Update vehicle details' : 'Add a new vehicle to the inventory'}
          </p>
        </div>
        <AddVehicleView vehicle={editingVehicle} onSuccess={handleVehicleSuccess} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Listed Vehicles</h1>
        <p className="text-gray-600">Manage all vehicles in the inventory</p>
      </div>
      <ListedVehiclesView onEditVehicle={handleEditVehicle} />
    </div>
  )
}

