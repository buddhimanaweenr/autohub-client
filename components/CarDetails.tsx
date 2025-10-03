'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import BookingWidget from './BookingWidget'

interface CarDetailsProps {
  carId: string
}

const carData = {
  id: 1,
  make: 'Toyota',
  model: 'Prius',
  year: 2018,
  price: '$11,630',
  images: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ],
  specs: {
    year: '2018',
    model: 'Prius',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    mileage: '45,000 miles',
    color: 'Blue',
    engine: '1.8L 4-Cylinder',
    drivetrain: 'FWD'
  },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
}

const similarCars = [
  {
    id: 2,
    make: 'Audi',
    model: 'A4',
    year: 2017,
    mileage: '4,638 miles',
    price: '$24,800',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    make: 'Volkswagen',
    model: 'Golf',
    year: 2014,
    mileage: '240 miles',
    price: '$15,200',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    make: 'Nissan',
    model: 'Altima',
    year: 2015,
    mileage: '839 miles',
    price: '$15,600',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
]

export default function CarDetails({ carId }: CarDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookingWidget, setShowBookingWidget] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carData.images.length) % carData.images.length)
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
              {carData.make} {carData.model} {carData.year}
            </h1>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative">
                <img
                  src={carData.images[currentImageIndex]}
                  alt={`${carData.make} ${carData.model}`}
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
                {carData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${carData.make} ${carData.model} ${index + 1}`}
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
                <div>
                  <span className="text-gray-600">Year:</span>
                  <span className="ml-2 font-medium">{carData.specs.year}</span>
                </div>
                <div>
                  <span className="text-gray-600">Model:</span>
                  <span className="ml-2 font-medium">{carData.specs.model}</span>
                </div>
                <div>
                  <span className="text-gray-600">Transmission:</span>
                  <span className="ml-2 font-medium">{carData.specs.transmission}</span>
                </div>
                <div>
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="ml-2 font-medium">{carData.specs.fuelType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Mileage:</span>
                  <span className="ml-2 font-medium">{carData.specs.mileage}</span>
                </div>
                <div>
                  <span className="text-gray-600">Color:</span>
                  <span className="ml-2 font-medium">{carData.specs.color}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{carData.description}</p>
            </div>

            {/* Similar Vehicles */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Vehicles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarCars.map((car) => (
                  <Link
                    key={car.id}
                    href={`/cars/${car.id}`}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600 text-xs mb-1">{car.year}</p>
                      <p className="text-gray-500 text-xs mb-1">{car.mileage}</p>
                      <p className="text-primary-600 font-bold text-sm">{car.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selling Price</h3>
                <p className="text-3xl font-bold text-primary-600">{carData.price}</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowBookingWidget(true)}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Book Inspection
                </button>
                <button className="w-full border border-primary-600 text-primary-600 py-3 px-6 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                  Request Quote
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Contact Us
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{carData.specs.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-medium">{carData.specs.mileage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transmission:</span>
                    <span className="font-medium">{carData.specs.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Type:</span>
                    <span className="font-medium">{carData.specs.fuelType}</span>
                  </div>
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
            <BookingWidget />
          </div>
        </div>
      )}
    </div>
  )
}
