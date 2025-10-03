'use client'

import { FaCar, FaGlobe, FaUsers, FaMapMarkerAlt } from 'react-icons/fa'

export default function StatsSection() {
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
            <span className="text-red-500 text-sm font-bold tracking-widest uppercase">STATISTICS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            OUR <span className="text-red-500">IMPACT</span>
          </h2>
          <p className="text-lg text-gray-300 font-medium">
            Numbers that speak for our global presence and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-red-500/30 hover:border-red-500/60 transition-all duration-300 text-center group hover:transform hover:scale-105">
            <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaCar className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500 mb-2">282,078</div>
            <div className="text-gray-300 font-bold text-sm sm:text-base uppercase tracking-wide">Total Cars Available</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-red-500/30 hover:border-red-500/60 transition-all duration-300 text-center group hover:transform hover:scale-105">
            <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaGlobe className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500 mb-2">30+</div>
            <div className="text-gray-300 font-bold text-sm sm:text-base uppercase tracking-wide">Global Offices</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-red-500/30 hover:border-red-500/60 transition-all duration-300 text-center group hover:transform hover:scale-105">
            <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaUsers className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500 mb-2">4000+</div>
            <div className="text-gray-300 font-bold text-sm sm:text-base uppercase tracking-wide">Happy Customers</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-red-500/30 hover:border-red-500/60 transition-all duration-300 text-center group hover:transform hover:scale-105">
            <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaMapMarkerAlt className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500 mb-2">7</div>
            <div className="text-gray-300 font-bold text-sm sm:text-base uppercase tracking-wide">Inventory Locations</div>
          </div>
        </div>
      </div>
    </section>
  )
}
