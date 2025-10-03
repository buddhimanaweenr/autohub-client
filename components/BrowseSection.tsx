'use client'

import { 
  FaCar, 
  FaTruck, 
  FaBus, 
  FaShuttleVan,
  FaCarSide,
  FaTruckPickup,
  FaCarAlt,
  FaIndustry
} from 'react-icons/fa'
import { 
  MdDirectionsCar
} from 'react-icons/md'
import ReactCountryFlag from 'react-country-flag'
import { useState } from 'react'

const carBrands = [
  { name: 'Toyota', count: 63513, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Toyota_logo.svg' },
  { name: 'Honda', count: 20929, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Honda_logo.svg' },
  { name: 'Nissan', count: 23692, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_logo.svg' },
  { name: 'Mazda', count: 8922, logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Mazda_logo.svg' },
  { name: 'Suzuki', count: 19783, logo: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Suzuki_logo_2.svg' },
  { name: 'Mitsubishi', count: 6133, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Mitsubishi_logo.svg' },
  { name: 'BMW', count: 10855, logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
  { name: 'Mercedes', count: 9164, logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg' },
  { name: 'Audi', count: 4277, logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
  { name: 'Lexus', count: 2103, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Lexus_logo.svg' },
  { name: 'Land Rover', count: 5013, logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Land_Rover_logo.svg' },
  { name: 'Ford', count: 3157, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' },
  { name: 'Hyundai', count: 22782, logo: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Hyundai_Motor_Company_logo.svg' },
  { name: 'Kia', count: 22553, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Kia_logo.svg' },
  { name: 'Volkswagen', count: 3513, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
  { name: 'Subaru', count: 8735, logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Subaru_logo.svg' }
]

const bodyTypes = [
  { name: 'Sedan', count: 53515, icon: FaCar },
  { name: 'Coupe', count: 7902, icon: FaCarSide },
  { name: 'Hatchback', count: 54415, icon: MdDirectionsCar },
  { name: 'Station Wagon', count: 8436, icon: FaShuttleVan },
  { name: 'SUV', count: 68884, icon: FaCarAlt },
  { name: 'Pick up', count: 6919, icon: FaTruckPickup },
  { name: 'Van', count: 17399, icon: FaShuttleVan },
  { name: 'Mini Van', count: 25666, icon: FaShuttleVan },
  { name: 'Wagon', count: 19830, icon: FaShuttleVan },
  { name: 'Convertible', count: 3862, icon: FaCarSide },
  { name: 'Bus', count: 195, icon: FaBus },
  { name: 'Truck', count: 14751, icon: FaTruck }
]

const inventoryLocations = [
  { name: 'Japan', count: 179994, countryCode: 'JP' },
  { name: 'Korea', count: 83588, countryCode: 'KR' },
  { name: 'Singapore', count: 1819, countryCode: 'SG' },
  { name: 'Thailand', count: 5055, countryCode: 'TH' },
  { name: 'China', count: 292, countryCode: 'CN' },
  { name: 'UK', count: 8383, countryCode: 'GB' },
  { name: 'UAE', count: 2947, countryCode: 'AE' }
]

// Brand Card Component with fallback
function BrandCard({ brand, index }: { brand: any, index: number }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-red-500/30 hover:border-red-500/60 hover:bg-white/20 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105">
      <div className="w-12 h-12 mb-3 flex-shrink-0 flex items-center justify-center">
        {!imageError ? (
          <img 
            src={brand.logo} 
            alt={`${brand.name} logo`}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <FaIndustry className="w-8 h-8 text-red-500" />
        )}
      </div>
      <span className="font-bold text-white text-sm text-center mb-1">{brand.name}</span>
      <span className="text-xs text-red-400 font-bold">({brand.count.toLocaleString()})</span>
    </div>
  )
}

export default function BrowseSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-red-500 text-sm font-bold tracking-widest uppercase">BROWSE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            FOR YOU TO <span className="text-red-500">CHOOSE</span>
          </h2>
          <p className="text-lg text-gray-300 font-medium">
            Explore our extensive inventory by brand, body type, and location
          </p>
        </div>
        
        <div className="space-y-16">
          {/* Browse by Car Brand */}
          <div>
            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-wide">Browse by Car Brand</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {carBrands.map((brand, index) => (
                <BrandCard key={index} brand={brand} index={index} />
              ))}
            </div>
          </div>

          {/* Browse by Body Type */}
          <div>
            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-wide">Browse by Body Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {bodyTypes.map((type, index) => {
                const IconComponent = type.icon
                return (
                  <div key={index} className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-red-500/30 hover:border-red-500/60 hover:bg-white/20 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105">
                    <IconComponent className="w-8 h-8 text-red-500 mb-3" />
                    <span className="font-bold text-white text-sm text-center mb-1">{type.name}</span>
                    <span className="text-xs text-red-400 font-bold">({type.count.toLocaleString()})</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Browse by Inventory Location */}
          <div>
            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-wide">Browse by Inventory Location</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {inventoryLocations.map((location, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-red-500/30 hover:border-red-500/60 hover:bg-white/20 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105">
                  <ReactCountryFlag 
                    countryCode={location.countryCode}
                    svg
                    style={{
                      width: '32px',
                      height: '24px',
                      marginBottom: '12px'
                    }}
                  />
                  <span className="font-bold text-white text-sm text-center mb-1">{location.name}</span>
                  <span className="text-xs text-red-400 font-bold">({location.count.toLocaleString()})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
