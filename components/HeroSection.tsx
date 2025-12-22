'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSearch, FaChevronDown, FaCog, FaCar, FaCalendarAlt, FaDollarSign, FaCog as FaGear } from 'react-icons/fa'
import { VEHICLE_MAKES } from '@/lib/constants/vehicleMakes'

interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  icon: React.ReactNode
  className?: string
}

function CustomDropdown({ options, value, onChange, placeholder, icon, className = '' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 hover:border-red-400 flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <span className="text-red-500 mr-3">{icon}</span>
          <span className="font-semibold text-gray-800">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.count && (
            <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              {selectedOption.count}
            </span>
          )}
        </div>
        <FaChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 flex items-center justify-between ${
                    value === option.value ? 'bg-red-50 text-red-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    {option.icon && <span className="text-red-500 mr-3">{option.icon}</span>}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  {option.count && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {option.count}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function HeroSection() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    make: '',
    model: '',
    bodyType: '',
    priceRange: '',
    year: '',
    transmission: '',
    fuelType: '',
    mileage: ''
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  // Counts for display purposes (can be made dynamic later)
  const makeCounts: { [key: string]: number } = {
    toyota: 45230,
    honda: 32150,
    nissan: 28940,
    mazda: 18720,
    suzuki: 15680,
    mitsubishi: 12340,
    daihatsu: 9870,
    subaru: 7650,
    volkswagen: 5430,
    bmw: 4320,
    mercedes: 3890,
    audi: 3210,
    lexus: 2890,
    landrover: 2340,
    ford: 1980,
    peugeot: 1650,
    jeep: 1420,
    jaguar: 980,
    hyundai: 870,
    kia: 650
  }

  const carMakes: DropdownOption[] = VEHICLE_MAKES.map(make => ({
    ...make,
    icon: <FaCar />,
    count: makeCounts[make.value] || 0
  }))

  const bodyTypes: DropdownOption[] = [
    { value: 'sedan', label: 'Sedan', icon: <FaCar />, count: 125430 },
    { value: 'suv', label: 'SUV', icon: <FaCar />, count: 98760 },
    { value: 'hatchback', label: 'Hatchback', icon: <FaCar />, count: 65430 },
    { value: 'pickup', label: 'Pick up', icon: <FaCar />, count: 43210 },
    { value: 'coupe', label: 'Coupe', icon: <FaCar />, count: 32150 },
    { value: 'convertible', label: 'Convertible', icon: <FaCar />, count: 18920 },
    { value: 'van', label: 'Van', icon: <FaCar />, count: 15680 },
    { value: 'truck', label: 'Truck', icon: <FaCar />, count: 12340 },
    { value: 'bus', label: 'Bus', icon: <FaCar />, count: 8760 }
  ]

  const priceRanges: DropdownOption[] = [
    { value: 'under5k', label: 'Under $5,000', icon: <FaDollarSign />, count: 45670 },
    { value: '5k-10k', label: '$5,000 - $10,000', icon: <FaDollarSign />, count: 78920 },
    { value: '10k-20k', label: '$10,000 - $20,000', icon: <FaDollarSign />, count: 123450 },
    { value: '20k-50k', label: '$20,000 - $50,000', icon: <FaDollarSign />, count: 87650 },
    { value: '50k-100k', label: '$50,000 - $100,000', icon: <FaDollarSign />, count: 23450 },
    { value: 'over100k', label: 'Over $100,000', icon: <FaDollarSign />, count: 5430 }
  ]

  const years: DropdownOption[] = Array.from({ length: 15 }, (_, i) => ({
    value: (2024 - i).toString(),
    label: (2024 - i).toString(),
    icon: <FaCalendarAlt />,
    count: Math.floor(Math.random() * 50000) + 10000
  }))

  const transmissions: DropdownOption[] = [
    { value: 'manual', label: 'Manual', icon: <FaGear />, count: 156780 },
    { value: 'automatic', label: 'Automatic', icon: <FaGear />, count: 234560 },
    { value: 'cvt', label: 'CVT', icon: <FaGear />, count: 87650 },
    { value: 'semi-automatic', label: 'Semi-Automatic', icon: <FaGear />, count: 43210 }
  ]

  const fuelTypes: DropdownOption[] = [
    { value: 'gasoline', label: 'Gasoline', icon: <FaCar />, count: 345670 },
    { value: 'diesel', label: 'Diesel', icon: <FaCar />, count: 123450 },
    { value: 'hybrid', label: 'Hybrid', icon: <FaCar />, count: 87650 },
    { value: 'electric', label: 'Electric', icon: <FaCar />, count: 23450 },
    { value: 'lpg', label: 'LPG', icon: <FaCar />, count: 12340 }
  ]

  const mileageRanges: DropdownOption[] = [
    { value: 'under50k', label: 'Under 50,000 km', icon: <FaCar />, count: 234560 },
    { value: '50k-100k', label: '50,000 - 100,000 km', icon: <FaCar />, count: 345670 },
    { value: '100k-150k', label: '100,000 - 150,000 km', icon: <FaCar />, count: 123450 },
    { value: '150k-200k', label: '150,000 - 200,000 km', icon: <FaCar />, count: 87650 },
    { value: 'over200k', label: 'Over 200,000 km', icon: <FaCar />, count: 43210 }
  ]

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (searchData.make) {
      params.set('make', searchData.make)
    }
    if (searchData.year) {
      params.set('year', searchData.year)
    }
    if (searchData.transmission) {
      // Map transmission values to match SearchResults options
      const transmissionMap: { [key: string]: string } = {
        'automatic': 'Automatic',
        'manual': 'Manual',
        'cvt': 'CVT',
        'semi-automatic': 'Automatic'
      }
      const mappedTransmission = transmissionMap[searchData.transmission] || searchData.transmission
      params.set('transmission', mappedTransmission)
    }
    if (searchData.fuelType) {
      // Map fuel type values to match SearchResults options
      const fuelTypeMap: { [key: string]: string } = {
        'gasoline': 'Petrol',
        'diesel': 'Diesel',
        'hybrid': 'Hybrid',
        'electric': 'Electric',
        'lpg': 'Petrol'
      }
      const mappedFuelType = fuelTypeMap[searchData.fuelType] || searchData.fuelType
      params.set('fuelType', mappedFuelType)
    }
    if (searchData.priceRange) {
      // Parse price range if needed (e.g., "under5k" -> priceMin=0, priceMax=5)
      // For now, just pass it as is if it's a simple format
      const priceMap: { [key: string]: { min: string; max: string } } = {
        'under5k': { min: '0', max: '5' },
        '5k-10k': { min: '5', max: '10' },
        '10k-20k': { min: '10', max: '20' },
        '20k-30k': { min: '20', max: '30' },
        '30k-50k': { min: '30', max: '50' },
        'over50k': { min: '50', max: '1000' }
      }
      if (priceMap[searchData.priceRange]) {
        params.set('priceMin', priceMap[searchData.priceRange].min)
        params.set('priceMax', priceMap[searchData.priceRange].max)
      }
    }
    
    const queryString = params.toString()
    router.push(`/search${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <section className="relative h-screen bg-black overflow-hidden flex flex-col">
      {/* Aggressive Background with Multiple Layers */}
      <div className="absolute inset-0">
        {/* Primary aggressive background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        
        {/* Aggressive red accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/15 via-transparent to-red-600/15"></div>
      </div>

      {/* Animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        {/* Reduced Typography */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <span className="text-red-500 text-xs font-bold tracking-widest uppercase">AUTOHUB</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
            <span className="text-white">DRIVE</span>
            <span className="text-red-500 ml-2">WHAT'S NEXT</span>
          </h1>
          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">
            282,078
          </div>
          <div className="text-sm sm:text-base text-gray-300 font-medium tracking-wide">
            PREMIUM CARS • WORLDWIDE SHIPPING • GUARANTEED QUALITY
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-5xl mx-auto border border-red-200">
          {/* Basic Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Make Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Vehicle Make
              </label>
              <CustomDropdown
                options={carMakes}
                value={searchData.make}
                onChange={(value) => handleInputChange('make', value)}
                placeholder="Select Make"
                icon={<FaCar />}
              />
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Body Type
              </label>
              <CustomDropdown
                options={bodyTypes}
                value={searchData.bodyType}
                onChange={(value) => handleInputChange('bodyType', value)}
                placeholder="Select Body Type"
                icon={<FaCar />}
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Price Range
              </label>
              <CustomDropdown
                options={priceRanges}
                value={searchData.priceRange}
                onChange={(value) => handleInputChange('priceRange', value)}
                placeholder="Select Price Range"
                icon={<FaDollarSign />}
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Year
              </label>
              <CustomDropdown
                options={years}
                value={searchData.year}
                onChange={(value) => handleInputChange('year', value)}
                placeholder="Select Year"
                icon={<FaCalendarAlt />}
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-red-600 hover:text-red-700 font-bold text-sm transition-colors duration-200"
            >
              <FaCog className="w-3 h-3 mr-2" />
              {showAdvanced ? 'Hide' : 'Show '} Advanced Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Transmission
                </label>
                <CustomDropdown
                  options={transmissions}
                  value={searchData.transmission}
                  onChange={(value) => handleInputChange('transmission', value)}
                  placeholder="Select Transmission"
                  icon={<FaGear />}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Fuel Type
                </label>
                <CustomDropdown
                  options={fuelTypes}
                  value={searchData.fuelType}
                  onChange={(value) => handleInputChange('fuelType', value)}
                  placeholder="Select Fuel Type"
                  icon={<FaCar />}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  Mileage
                </label>
                <CustomDropdown
                  options={mileageRanges}
                  value={searchData.mileage}
                  onChange={(value) => handleInputChange('mileage', value)}
                  placeholder="Select Mileage Range"
                  icon={<FaCar />}
                />
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="text-center">
            <a 
              href="/search"
              onClick={handleSearch}
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-10 rounded-xl font-black text-lg shadow-2xl hover:shadow-red-500/25 hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide"
            >
              <FaSearch className="w-5 h-5 mr-2" />
              SEARCH CARS
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}