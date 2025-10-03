'use client'

import { FaNewspaper, FaCar, FaEnvelope, FaArrowRight, FaCalendarAlt, FaTag } from 'react-icons/fa'

const newsItems = [
  {
    title: "Toyota RAV4 Hybrid – A Smart Choice for Rwanda Drivers",
    date: "1 day ago",
    category: "Buying"
  },
  {
    title: "An Overview of SBT Japan's Partner Stock: What Buyers Need to Know",
    date: "4 days ago",
    category: "Buying"
  },
  {
    title: "How To Choose A Reliable Japanese Used Car Exporter In 2025?",
    date: "2 weeks ago",
    category: "Car Information"
  }
]

export default function NewsSection() {
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
            <span className="text-red-500 text-sm font-bold tracking-widest uppercase">NEWS & UPDATES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            STAY <span className="text-red-500">INFORMED</span>
          </h2>
          <p className="text-lg text-gray-300 font-medium">
            Latest news, updates, and insights from the automotive world
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* News Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-red-500/30">
              <div className="flex items-center mb-6">
                <FaNewspaper className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wide">AUTOHUB NEWS</h3>
              </div>
              <div className="space-y-6">
                {newsItems.map((item, index) => (
                  <div key={index} className="border-b border-red-500/30 pb-6 last:border-b-0 hover:bg-white/5 p-4 rounded-lg transition-colors">
                    <h4 className="text-lg font-bold text-white mb-3 hover:text-red-400 transition-colors cursor-pointer">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-400">
                        <FaCalendarAlt className="w-3 h-3 mr-2" />
                        <span>{item.date}</span>
                      </div>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        <FaTag className="w-3 h-3 inline mr-1" />
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a href="/news" className="inline-flex items-center text-red-400 hover:text-red-300 font-bold transition-colors">
                  See more news
                  <FaArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>

          {/* Request a Car & Newsletter */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 lg:p-8 rounded-2xl border border-red-500/30">
              <div className="flex items-center mb-4">
                <FaCar className="w-6 h-6 mr-3" />
                <h3 className="text-xl font-black uppercase tracking-wide">Request a Car</h3>
              </div>
              <p className="text-red-100 mb-6 font-medium leading-relaxed">
                Request any used Japanese car and we will buy it from the auction for you.
              </p>
              <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-black hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide">
                Request a Car
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-red-500/30">
              <div className="flex items-center mb-4">
                <FaEnvelope className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-xl font-black text-white uppercase tracking-wide">Newsletter</h3>
              </div>
              <p className="text-gray-300 mb-6 font-medium leading-relaxed">
                Get information about new arrivals and special offers
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
                <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-black hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
