'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaSearch, FaChevronDown } from 'react-icons/fa'
import { fetchVehicles, Vehicle } from '@/lib/api'

export default function SearchResults() {
  const [filters, setFilters] = useState({
    make: 'All',
    year: '2015',
    yearTo: '2020',
    priceMin: '30',
    priceMax: '40',
    transmission: 'Normal',
    fuelType: 'Hybrid'
  })
  const [cars, setCars] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true)
        setError(null)
        const vehicles = await fetchVehicles()
        setCars(vehicles)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicles')
        console.error('Error loading vehicles:', err)
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
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

  // Filter cars based on search and filters
  const filteredCars = cars.filter((car) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const makeModel = `${car.make || ''} ${car.model || ''}`.toLowerCase()
      if (!makeModel.includes(query)) {
        return false
      }
    }
    // Add more filter logic here if needed
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
              
              <div className="space-y-6">
                {/* Make Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>All</option>
                    <option>Honda</option>
                    <option>BMW</option>
                    <option>Audi</option>
                    <option>Toyota</option>
                    <option>Nissan</option>
                  </select>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="2015"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="2020"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">30k</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">40k</span>
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Normal</option>
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Hybrid</option>
                    <option>Gasoline</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Search Results</h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter by search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>Sort By</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Year: Newest</option>
                      <option>Year: Oldest</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading vehicles...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="text-center py-12">
                  <p className="text-red-600 text-lg mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Cars Grid */}
              {!loading && !error && (
                <>
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No vehicles found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCars.map((car) => {
                        const carId = car.id?.toString() || car._id?.toString() || ''
                        return (
                        <Link
                          key={carId}
                          href={`/cars/${carId}`}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="aspect-w-16 aspect-h-12">
                            <img
                              src={getVehicleImage(car)}
                              alt={`${car.make || 'Unknown'} ${car.model || 'Vehicle'}`}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {car.make || 'Unknown'} {car.model || 'Vehicle'}
                            </h3>
                            {car.year && <p className="text-gray-600 text-sm mb-2">{car.year}</p>}
                            {car.mileage && <p className="text-gray-500 text-sm mb-2">{formatMileage(car.mileage)}</p>}
                            <p className="text-primary-600 font-bold text-lg">{formatPrice(car.price || car.sellingPrice)}</p>
                          </div>
                        </Link>
                        )
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-2 bg-primary-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
