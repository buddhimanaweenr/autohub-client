'use client'

import { useState, useEffect, useRef } from 'react'
import { createVehicle, updateVehicle } from '@/lib/admin/api'
import type { CreateVehicleData } from '@/lib/admin/api'
import type { Vehicle } from '@/lib/vehicle/types'
import { VEHICLE_MAKES } from '@/lib/constants/vehicleMakes'

interface AddVehicleViewProps {
  vehicle?: Vehicle | null
  onSuccess?: () => void
}

interface ImagePreview {
  id: string
  type: 'file' | 'url' | 'existing'
  preview: string
  file?: File
  url?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

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
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])
  const [imagesInput, setImagesInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditMode = !!vehicle

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Get full image URL (handles both relative paths and full URLs)
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return ''
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    // If it's a base64 data URL, return as is
    if (imagePath.startsWith('data:image')) {
      return imagePath
    }
    // Otherwise, assume it's a relative path from the API
    if (imagePath.startsWith('/')) {
      return `${API_BASE_URL}${imagePath}`
    }
    return `${API_BASE_URL}/${imagePath}`
  }

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
      
      // Set up image previews for existing images
      if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        const existingPreviews: ImagePreview[] = vehicle.images.map((img, index) => ({
          id: `existing-${index}-${Date.now()}`,
          type: 'existing',
          preview: getImageUrl(img),
          url: img,
        }))
        setImagePreviews(existingPreviews)
        setImagesInput(vehicle.images.join('\n'))
      } else if (vehicle.image) {
        const existingPreviews: ImagePreview[] = [{
          id: `existing-0-${Date.now()}`,
          type: 'existing',
          preview: getImageUrl(vehicle.image),
          url: vehicle.image,
        }]
        setImagePreviews(existingPreviews)
        setImagesInput(vehicle.image)
      } else {
        setImagePreviews([])
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
      setImagePreviews([])
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

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newPreviews: ImagePreview[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only JPEG, PNG, GIF, and WebP are allowed.`)
        continue
      }

      // Validate file size
      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`)
        continue
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file)
      newPreviews.push({
        id: `file-${Date.now()}-${i}`,
        type: 'file',
        preview: previewUrl,
        file,
      })
    }

    setImagePreviews((prev) => [...prev, ...newPreviews])
    setError('') // Clear error after successful addition
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Remove image preview
  const removeImagePreview = (id: string) => {
    setImagePreviews((prev) => {
      const preview = prev.find((p) => p.id === id)
      if (preview && preview.type === 'file') {
        URL.revokeObjectURL(preview.preview)
      }
      return prev.filter((p) => p.id !== id)
    })
  }

  // Handle URL input change
  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setImagesInput(value)
    
    // Split by newline or comma and filter empty strings
    const imageUrls = value
      .split(/[,\n]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    // Update previews for URLs (keep file and existing previews)
    setImagePreviews((prev) => {
      // Keep file and existing previews
      const fileAndExistingPreviews = prev.filter((p) => p.type !== 'url')
      // Add new URL previews
      const urlPreviews: ImagePreview[] = imageUrls.map((url, index) => ({
        id: `url-${Date.now()}-${index}`,
        type: 'url',
        preview: url.startsWith('data:image') ? url : getImageUrl(url),
        url,
      }))
      return [...fileAndExistingPreviews, ...urlPreviews]
    })
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

      // Convert file previews to base64 and collect all images
      const base64Images: string[] = []
      
      for (const preview of imagePreviews) {
        if (preview.type === 'file' && preview.file) {
          try {
            const base64 = await fileToBase64(preview.file)
            base64Images.push(base64)
          } catch (err) {
            console.error(`Failed to convert file ${preview.file.name} to base64:`, err)
            setError(`Failed to process image: ${preview.file.name}`)
            setLoading(false)
            return
          }
        } else if (preview.type === 'url' && preview.url) {
          // If it's a base64 data URL, use it directly
          if (preview.url.startsWith('data:image')) {
            base64Images.push(preview.url)
          } else {
            // Otherwise, keep the URL as is (backend will handle it)
            base64Images.push(preview.url)
          }
        } else if (preview.type === 'existing' && preview.url) {
          // For existing images, keep the original path/URL
          base64Images.push(preview.url)
        }
      }

      // Prepare vehicle data with images
      const vehicleData: CreateVehicleData = {
        ...formData,
        images: base64Images,
      }

      if (isEditMode && vehicle) {
        const vehicleId = vehicle._id || vehicle.id?.toString() || ''
        if (!vehicleId) {
          throw new Error('Vehicle ID is required for updating')
        }
        await updateVehicle(vehicleId, vehicleData)
        setSuccess(true)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        await createVehicle(vehicleData)
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
        
        // Clean up preview URLs
        imagePreviews.forEach((preview) => {
          if (preview.type === 'file') {
            URL.revokeObjectURL(preview.preview)
          }
        })
        
        setImagePreviews([])
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Images
            </label>
            
            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 8M7 16h13"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload images</span>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WebP up to 10MB each (max 10 files)
                </p>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview) => (
                    <div key={preview.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
                        <img
                          src={preview.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Handle broken image URLs
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EInvalid Image%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImagePreview(preview.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Remove image"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      {preview.type === 'file' && preview.file && (
                        <p className="mt-1 text-xs text-gray-500 truncate" title={preview.file.name}>
                          {preview.file.name}
                        </p>
                      )}
                      {preview.type === 'existing' && (
                        <p className="mt-1 text-xs text-gray-500 truncate" title="Existing image">
                          Existing
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {imagePreviews.length} image(s) selected
                </p>
              </div>
            )}

            {/* URL Input (Alternative method) */}
            <div className="mt-4">
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Or enter image URLs or base64 strings (one per line or comma-separated)
              </label>
              <textarea
                name="images"
                id="images"
                rows={3}
                value={imagesInput}
                onChange={handleImagesChange}
                placeholder="https://example.com/image1.jpg&#10;data:image/jpeg;base64,/9j/4AAQSkZJRg..."
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
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

