'use client'

import Link from 'next/link'
import { FaCar, FaCalendarAlt, FaTachometerAlt, FaArrowRight } from 'react-icons/fa'

const featuredCars = [
  {
    id: 1,
    make: 'Honda',
    model: 'Civic',
    year: 2014,
    mileage: '240 miles',
    price: '$12,500',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    make: 'BMW',
    model: 'X5',
    year: 2014,
    mileage: '322 miles',
    price: '$28,900',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    make: 'Toyota',
    model: 'Camry',
    year: 2016,
    mileage: '156 miles',
    price: '$18,200',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    make: 'Audi',
    model: 'A4',
    year: 2017,
    mileage: '89 miles',
    price: '$24,800',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    make: 'Nissan',
    model: 'Altima',
    year: 2015,
    mileage: '198 miles',
    price: '$15,600',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    make: 'Mercedes',
    model: 'C-Class',
    year: 2018,
    mileage: '45,000 km',
    price: '$32,500',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 7,
    make: 'Volkswagen',
    model: 'Golf',
    year: 2015,
    mileage: '78,000 km',
    price: '$16,800',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 8,
    make: 'Hyundai',
    model: 'Elantra',
    year: 2016,
    mileage: '65,000 km',
    price: '$14,200',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
]

export default function FeaturedCars() {
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {featuredCars.map((car) => (
            <Link 
              key={car.id} 
              href={`/cars/${car.id}`}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-red-500/30 hover:border-red-500/60 transition-all duration-300 overflow-hidden group hover:transform hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  {car.year}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-black text-lg mb-1">
                    {car.make} {car.model}
                  </h3>
                  <div className="flex items-center text-red-400 text-sm font-bold">
                    <FaTachometerAlt className="w-3 h-3 mr-1" />
                    {car.mileage}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-red-500">{car.price}</div>
                  <div className="flex items-center text-white text-sm font-bold">
                    View Details
                    <FaArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
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
