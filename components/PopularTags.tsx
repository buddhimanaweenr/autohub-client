'use client'

import { FaTag } from 'react-icons/fa'

const popularTags = [
  'Japan Inventory', 'SUV', 'Pick up', 'Under 1,000 USD', 'Truck', 'Sedan',
  'UK Inventory', 'Under 2,000 USD', 'Hybrid', 'Hatchback', 'Coupe',
  'Korea Inventory', 'LHD', '4WD', 'RHD', 'Low Mileage'
]

export default function PopularTags() {
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
            <span className="text-red-500 text-sm font-bold tracking-widest uppercase">POPULAR</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            TRENDING <span className="text-red-500">SEARCHES</span>
          </h2>
          <p className="text-lg text-gray-300 font-medium">
            Most searched terms and popular categories
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {popularTags.map((tag, index) => (
            <span 
              key={index}
              className="bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white cursor-pointer transition-all duration-300 border border-red-500/30 hover:border-red-500/60 hover:transform hover:scale-105 uppercase tracking-wide"
            >
              <FaTag className="w-3 h-3 inline mr-2" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
