'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaSearch, FaChevronDown } from 'react-icons/fa'
import { fetchVehicles, Vehicle } from '@/lib/api'
import { getMakeLabel, VEHICLE_MAKES } from '@/lib/constants/vehicleMakes'

export default function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize filters from URL parameters
  const getInitialFilters = () => ({
    make: searchParams.get('make') || 'All',
    year: searchParams.get('year') || '',
    yearTo: searchParams.get('yearTo') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    transmission: searchParams.get('transmission') || 'All',
    fuelType: searchParams.get('fuelType') || 'All'
  })

  const [filters, setFilters] = useState(getInitialFilters())
  const [cars, setCars] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  // Update filters when URL parameters change
  useEffect(() => {
    const newFilters = {
      make: searchParams.get('make') || 'All',
      year: searchParams.get('year') || '',
      yearTo: searchParams.get('yearTo') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      transmission: searchParams.get('transmission') || 'All',
      fuelType: searchParams.get('fuelType') || 'All'
    }
    setFilters(newFilters)
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])

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

  // Update URL when filters change
  const updateFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    
    if (newFilters.make && newFilters.make !== 'All') {
      params.set('make', newFilters.make)
    }
    if (newFilters.year) {
      params.set('year', newFilters.year)
    }
    if (newFilters.yearTo) {
      params.set('yearTo', newFilters.yearTo)
    }
    if (newFilters.priceMin) {
      params.set('priceMin', newFilters.priceMin)
    }
    if (newFilters.priceMax) {
      params.set('priceMax', newFilters.priceMax)
    }
    if (newFilters.transmission && newFilters.transmission !== 'All') {
      params.set('transmission', newFilters.transmission)
    }
    if (newFilters.fuelType && newFilters.fuelType !== 'All') {
      params.set('fuelType', newFilters.fuelType)
    }
    if (searchQuery) {
      params.set('q', searchQuery)
    }
    
    const queryString = params.toString()
    router.push(`/search${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

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
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const makeLabel = car.make ? getMakeLabel(car.make) : ''
      const makeModel = `${makeLabel} ${car.model || ''}`.toLowerCase()
      if (!makeModel.includes(query)) {
        return false
      }
    }

    // Make filter
    if (filters.make && filters.make !== 'All') {
      if (car.make !== filters.make) {
        return false
      }
    }

    // Year filter
    if (filters.year) {
      const year = typeof car.year === 'string' ? parseInt(car.year) : (car.year || 0)
      const filterYear = parseInt(filters.year)
      if (year < filterYear) {
        return false
      }
    }
    if (filters.yearTo) {
      const year = typeof car.year === 'string' ? parseInt(car.year) : (car.year || 0)
      const filterYearTo = parseInt(filters.yearTo)
      if (year > filterYearTo) {
        return false
      }
    }

    // Price filter
    if (filters.priceMin) {
      const price = typeof car.sellingPrice === 'number' 
        ? car.sellingPrice 
        : (typeof car.price === 'number' ? car.price : parseFloat(String(car.price || car.sellingPrice || 0)))
      const minPrice = parseFloat(filters.priceMin) * 1000 // Convert k to actual value
      if (price < minPrice) {
        return false
      }
    }
    if (filters.priceMax) {
      const price = typeof car.sellingPrice === 'number' 
        ? car.sellingPrice 
        : (typeof car.price === 'number' ? car.price : parseFloat(String(car.price || car.sellingPrice || 0)))
      const maxPrice = parseFloat(filters.priceMax) * 1000 // Convert k to actual value
      if (price > maxPrice) {
        return false
      }
    }

    // Transmission filter
    if (filters.transmission && filters.transmission !== 'All') {
      if (car.transmission !== filters.transmission) {
        return false
      }
    }

    // Fuel Type filter
    if (filters.fuelType && filters.fuelType !== 'All') {
      if (car.fuelType !== filters.fuelType) {
        return false
      }
    }

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
                  <select 
                    value={filters.make}
                    onChange={(e) => updateFilters({ ...filters, make: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="All">All</option>
                    {VEHICLE_MAKES.map((make) => (
                      <option key={make.value} value={make.value}>
                        {make.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="From"
                      value={filters.year}
                      onChange={(e) => updateFilters({ ...filters, year: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="To"
                      value={filters.yearTo}
                      onChange={(e) => updateFilters({ ...filters, yearTo: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (in thousands)</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => updateFilters({ ...filters, priceMin: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => updateFilters({ ...filters, priceMax: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select 
                    value={filters.transmission}
                    onChange={(e) => updateFilters({ ...filters, transmission: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="All">All</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select 
                    value={filters.fuelType}
                    onChange={(e) => updateFilters({ ...filters, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="All">All</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
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
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        const params = new URLSearchParams(searchParams.toString())
                        if (e.target.value) {
                          params.set('q', e.target.value)
                        } else {
                          params.delete('q')
                        }
                        router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
                      }}
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
                              alt={`${car.make ? getMakeLabel(car.make) : 'Unknown'} ${car.model || 'Vehicle'}`}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {car.make ? getMakeLabel(car.make) : 'Unknown'} {car.model || 'Vehicle'}
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
