'use client'

import { FaUser, FaFlag, FaGlobe, FaShieldAlt, FaShippingFast, FaHeadset } from 'react-icons/fa'

const features = [
  {
    icon: <FaUser className="w-8 h-8" />,
    title: "How to Buy",
    description: "Simple 3-step process to find and purchase your perfect car"
  },
  {
    icon: <FaFlag className="w-8 h-8" />,
    title: "Global Offices",
    description: "Serving customers in over 30 countries worldwide"
  },
  {
    icon: <FaGlobe className="w-8 h-8" />,
    title: "Worldwide Shipping",
    description: "We ship cars to any location on the planet"
  },
  {
    icon: <FaShieldAlt className="w-8 h-8" />,
    title: "Quality Guarantee",
    description: "100% quality inspection and warranty on all vehicles"
  },
  {
    icon: <FaShippingFast className="w-8 h-8" />,
    title: "Fast Delivery",
    description: "Express shipping options available worldwide"
  },
  {
    icon: <FaHeadset className="w-8 h-8" />,
    title: "24/7 Support",
    description: "Round-the-clock customer service and assistance"
  }
]

export default function FeaturesSection() {
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
            <span className="text-red-500 text-sm font-bold tracking-widest uppercase">FEATURES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            WHY CHOOSE <span className="text-red-500">AUTOHUB</span>
          </h2>
          <p className="text-lg text-gray-300 font-medium">
            Experience the difference with our premium services and global reach
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-red-500/30 hover:border-red-500/60 transition-all duration-300 text-center group hover:transform hover:scale-105">
              <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wide">
                {feature.title}
              </h3>
              <p className="text-gray-300 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}