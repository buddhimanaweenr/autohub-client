'use client'

import { useState, useEffect } from 'react'
import { createVehicle, updateVehicle } from '@/lib/admin/api'
import type { CreateVehicleData } from '@/lib/admin/api'
import type { Vehicle } from '@/lib/vehicle/types'
import { VEHICLE_MAKES } from '@/lib/constants/vehicleMakes'

interface AddVehicleViewProps {
  vehicle?: Vehicle | null
  onSuccess?: () => void
}

export default function AddVehicleView({ vehicle, onSuccess }: AddVehicleViewProps) {
  const [formData, setFormData] = useState<CreateVehicleData>({
    make: '',
    model: '',
    year: '',
    sellingPrice: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    color: '',
    engine: '',
    drivetrain: '',
    description: '',
    images: []
  })
  const [imagesInput, setImagesInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const isEditMode = !!vehicle

  // Populate form when vehicle prop changes
  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || '',
        sellingPrice: vehicle.sellingPrice || vehicle.price || '',
        mileage: vehicle.mileage || '',
        transmission: vehicle.transmission || '',
        fuelType: vehicle.fuelType || '',
        color: vehicle.color || '',
        engine: vehicle.engine || '',
        drivetrain: vehicle.drivetrain || '',
        description: vehicle.description || '',
        images: vehicle.images || []
      })
      // Set images input for display
      if (vehicle.images && Array.isArray(vehicle.images)) {
        setImagesInput(vehicle.images.join('\n'))
      } else if (vehicle.image) {
        setImagesInput(vehicle.image)
      } else {
        setImagesInput('')
      }
    } else {
      // Reset form for new vehicle
      setFormData({
        make: '',
        model: '',
        year: '',
        sellingPrice: '',
        mileage: '',
        transmission: '',
        fuelType: '',
        color: '',
        engine: '',
        drivetrain: '',
        description: '',
        images: []
      })
      setImagesInput('')
    }
  }, [vehicle])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'sellingPrice' || name === 'mileage' 
        ? (value === '' ? '' : Number(value))
        : value,
    }))
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setImagesInput(value)
    // Split by newline or comma and filter empty strings
    const imageUrls = value
      .split(/[,\n]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
    setFormData((prev) => ({
      ...prev,
      images: imageUrls,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.make || !formData.model || !formData.year || !formData.sellingPrice) {
        throw new Error('Please fill in all required fields (Make, Model, Year, Selling Price)')
      }

      if (isEditMode && vehicle) {
        const vehicleId = vehicle._id || vehicle.id?.toString() || ''
        if (!vehicleId) {
          throw new Error('Vehicle ID is required for updating')
        }
        await updateVehicle(vehicleId, formData)
        setSuccess(true)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        await createVehicle(formData)
        setSuccess(true)
        // Reset form only for new vehicles
        setFormData({
          make: '',
          model: '',
          year: '',
          sellingPrice: '',
          mileage: '',
          transmission: '',
          fuelType: '',
          color: '',
          engine: '',
          drivetrain: '',
          description: '',
          images: []
        })
        setImagesInput('')
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (err: any) {
      setError(err.message || (isEditMode ? 'Failed to update vehicle' : 'Failed to create vehicle'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h2>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="text-sm text-green-800">
            {isEditMode ? 'Vehicle updated successfully!' : 'Vehicle created successfully!'}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Required Fields */}
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700">
              Make <span className="text-red-500">*</span>
            </label>
            <select
              name="make"
              id="make"
              required
              value={formData.make}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Make...</option>
              {VEHICLE_MAKES.map((make) => (
                <option key={make.value} value={make.value}>
                  {make.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="model"
              id="model"
              required
              value={formData.model}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              id="year"
              required
              min="1900"
              max="2100"
              value={formData.year}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">
              Selling Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="sellingPrice"
              id="sellingPrice"
              required
              min="0"
              step="0.01"
              value={formData.sellingPrice}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Optional Fields */}
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
              Mileage
            </label>
            <input
              type="number"
              name="mileage"
              id="mileage"
              min="0"
              value={formData.mileage}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">
              Transmission
            </label>
            <select
              name="transmission"
              id="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </select>
          </div>

          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
              Fuel Type
            </label>
            <select
              name="fuelType"
              id="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="text"
              name="color"
              id="color"
              value={formData.color}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="engine" className="block text-sm font-medium text-gray-700">
              Engine
            </label>
            <input
              type="text"
              name="engine"
              id="engine"
              value={formData.engine}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="drivetrain" className="block text-sm font-medium text-gray-700">
              Drivetrain
            </label>
            <select
              name="drivetrain"
              id="drivetrain"
              value={formData.drivetrain}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="FWD">FWD</option>
              <option value="RWD">RWD</option>
              <option value="AWD">AWD</option>
              <option value="4WD">4WD</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Image URLs (one per line or comma-separated)
            </label>
            <textarea
              name="images"
              id="images"
              rows={4}
              value={imagesInput}
              onChange={handleImagesChange}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formData.images && formData.images.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {formData.images.length} image(s) added
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? (isEditMode ? 'Updating Vehicle...' : 'Creating Vehicle...') 
              : (isEditMode ? 'Update Vehicle' : 'Create Vehicle')
            }
          </button>
        </div>
      </form>
    </div>
  )
}

