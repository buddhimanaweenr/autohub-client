'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import BookingWidget from './BookingWidget'
import QuoteRequestWidget from './QuoteRequestWidget'
import { fetchVehicleById, fetchVehicles, Vehicle } from '@/lib/api'
import { getMakeLabel } from '@/lib/constants/vehicleMakes'

interface CarDetailsProps {
  carId: string
}

export default function CarDetails({ carId }: CarDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookingWidget, setShowBookingWidget] = useState(false)
  const [showQuoteWidget, setShowQuoteWidget] = useState(false)
  const [carData, setCarData] = useState<Vehicle | null>(null)
  const [similarCars, setSimilarCars] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCarData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch the specific vehicle
        const vehicle = await fetchVehicleById(carId)
        setCarData(vehicle)
        
        // Fetch all vehicles for similar cars section
        const allVehicles = await fetchVehicles()
        // Filter out current vehicle and get up to 3 similar vehicles
        // Compare both id and _id to handle different API response formats
        const currentVehicleId = vehicle.id?.toString() || vehicle._id?.toString()
        const similar = allVehicles
          .filter(v => {
            const vId = v.id?.toString() || v._id?.toString()
            return vId !== currentVehicleId
          })
          .slice(0, 3)
        setSimilarCars(similar)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicle data')
        console.error('Error loading car data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (carId) {
      loadCarData()
    }
  }, [carId])

  // Format price helper
  const formatPrice = (price: string | number | undefined): string => {
    if (!price) return 'N/A'
    if (typeof price === 'string') return price
    return `$${price.toLocaleString()}`
  }

  // Format mileage helper
  const formatMileage = (mileage: string | number | undefined): string => {
    if (!mileage) return 'N/A'
    if (typeof mileage === 'string') return mileage
    return `${mileage.toLocaleString()} miles`
  }

  // Get images array - handle both 'images' and 'image' properties
  const getImages = (vehicle: Vehicle | null): string[] => {
    if (!vehicle) return []
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images
    }
    if (vehicle.image) {
      return [vehicle.image]
    }
    // Fallback image
    return ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (error || !carData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Vehicle not found'}</p>
          <Link href="/search" className="text-primary-600 hover:text-primary-700">
            ← Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const images = getImages(carData)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/search" className="text-primary-600 hover:text-primary-700">
            ← Back to Search
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {carData.make ? getMakeLabel(carData.make) : 'Unknown'} {carData.model || 'Vehicle'} {carData.year || ''}
            </h1>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative">
                <img
                  src={images[currentImageIndex]}
                  alt={`${carData.make ? getMakeLabel(carData.make) : 'Unknown'} ${carData.model || 'Vehicle'}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-2 mt-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${carData.make ? getMakeLabel(carData.make) : 'Unknown'} ${carData.model || 'Vehicle'} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Specs</h2>
              <div className="grid grid-cols-2 gap-4">
                {carData.make && (
                  <div>
                    <span className="text-gray-600">Make:</span>
                    <span className="ml-2 font-medium">{getMakeLabel(carData.make)}</span>
                  </div>
                )}
                {carData.year && (
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <span className="ml-2 font-medium">{carData.year}</span>
                  </div>
                )}
                {carData.model && (
                  <div>
                    <span className="text-gray-600">Model:</span>
                    <span className="ml-2 font-medium">{carData.model}</span>
                  </div>
                )}
                {carData.transmission && (
                  <div>
                    <span className="text-gray-600">Transmission:</span>
                    <span className="ml-2 font-medium">{carData.transmission}</span>
                  </div>
                )}
                {carData.fuelType && (
                  <div>
                    <span className="text-gray-600">Fuel Type:</span>
                    <span className="ml-2 font-medium">{carData.fuelType}</span>
                  </div>
                )}
                {carData.mileage && (
                  <div>
                    <span className="text-gray-600">Mileage:</span>
                    <span className="ml-2 font-medium">{formatMileage(carData.mileage)}</span>
                  </div>
                )}
                {carData.color && (
                  <div>
                    <span className="text-gray-600">Color:</span>
                    <span className="ml-2 font-medium">{carData.color}</span>
                  </div>
                )}
                {carData.engine && (
                  <div>
                    <span className="text-gray-600">Engine:</span>
                    <span className="ml-2 font-medium">{carData.engine}</span>
                  </div>
                )}
                {carData.drivetrain && (
                  <div>
                    <span className="text-gray-600">Drivetrain:</span>
                    <span className="ml-2 font-medium">{carData.drivetrain}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {carData.description && (
              <div className="bg-white rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{carData.description}</p>
              </div>
            )}

            {/* Similar Vehicles */}
            {similarCars.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Vehicles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similarCars.map((car) => {
                    const carImage = car.images?.[0] || car.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                    const carId = car.id?.toString() || car._id?.toString() || ''
                    return (
                      <Link
                        key={carId}
                        href={`/cars/${carId}`}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <img
                          src={carImage}
                          alt={`${car.make ? getMakeLabel(car.make) : 'Unknown'} ${car.model || 'Vehicle'}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {car.make ? getMakeLabel(car.make) : 'Unknown'} {car.model || 'Vehicle'}
                          </h3>
                          {car.year && <p className="text-gray-600 text-xs mb-1">{car.year}</p>}
                          {car.mileage && <p className="text-gray-500 text-xs mb-1">{formatMileage(car.mileage)}</p>}
                          <p className="text-primary-600 font-bold text-sm">{formatPrice(car.price || car.sellingPrice)}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selling Price</h3>
                <p className="text-3xl font-bold text-primary-600">{formatPrice(carData.price || carData.sellingPrice)}</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowBookingWidget(true)}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Book Inspection
                </button>
                <button 
                  onClick={() => setShowQuoteWidget(true)}
                  className="w-full border border-primary-600 text-primary-600 py-3 px-6 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Request Quote
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Contact Us
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  {carData.year && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year:</span>
                      <span className="font-medium">{carData.year}</span>
                    </div>
                  )}
                  {carData.mileage && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mileage:</span>
                      <span className="font-medium">{formatMileage(carData.mileage)}</span>
                    </div>
                  )}
                  {carData.transmission && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transmission:</span>
                      <span className="font-medium">{carData.transmission}</span>
                    </div>
                  )}
                  {carData.fuelType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span className="font-medium">{carData.fuelType}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Widget Modal */}
      {showBookingWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBookingWidget(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <BookingWidget vehicle={carData} onClose={() => setShowBookingWidget(false)} />
          </div>
        </div>
      )}

      {/* Quote Request Widget Modal */}
      {showQuoteWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto">
            <QuoteRequestWidget vehicle={carData} onClose={() => setShowQuoteWidget(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
