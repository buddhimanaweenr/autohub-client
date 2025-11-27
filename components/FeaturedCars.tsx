'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaCar, FaCalendarAlt, FaTachometerAlt, FaArrowRight } from 'react-icons/fa'
import { fetchVehicles, Vehicle } from '@/lib/api'

export default function FeaturedCars() {
  const [featuredCars, setFeaturedCars] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedCars() {
      try {
        setLoading(true)
        const vehicles = await fetchVehicles()
        // Take first 8 vehicles as featured, or all if less than 8
        setFeaturedCars(vehicles.slice(0, 8))
      } catch (err) {
        console.error('Error loading featured cars:', err)
        // Set empty array on error so component still renders
        setFeaturedCars([])
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedCars()
  }, [])

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

  // Get image from vehicle
  const getVehicleImage = (vehicle: Vehicle): string => {
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images[0]
    }
    if (vehicle.image) {
      return vehicle.image
    }
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-red-500 text-sm font-bold tracking-widest uppercase">FEATURED</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            PREMIUM <span className="text-red-500">SELECTION</span>
          </h2>
          <p className="text-lg text-gray-300 font-medium">
            Hand-picked vehicles from our extensive inventory
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading featured vehicles...</p>
            </div>
          </div>
        ) : featuredCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No featured vehicles available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {featuredCars.map((car) => {
              const carId = car.id?.toString() || car._id?.toString() || ''
              return (
              <Link 
                key={carId} 
                href={`/cars/${carId}`}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-red-500/30 hover:border-red-500/60 transition-all duration-300 overflow-hidden group hover:transform hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getVehicleImage(car)}
                    alt={`${car.make || 'Unknown'} ${car.model || 'Vehicle'}`}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  {car.year && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      {car.year}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-black text-lg mb-1">
                      {car.make || 'Unknown'} {car.model || 'Vehicle'}
                    </h3>
                    {car.mileage && (
                      <div className="flex items-center text-red-400 text-sm font-bold">
                        <FaTachometerAlt className="w-3 h-3 mr-1" />
                        {formatMileage(car.mileage)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-red-500">{formatPrice(car.price || car.sellingPrice)}</div>
                    <div className="flex items-center text-white text-sm font-bold">
                      View Details
                      <FaArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
              )
            })}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href="/search"
            className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-black text-lg shadow-2xl hover:shadow-red-500/25 hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide"
          >
            <FaCar className="w-5 h-5 mr-3" />
            VIEW ALL CARS
          </Link>
        </div>
      </div>
    </section>
  )
}
