'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaSearch, FaUser, FaHeart, FaBars, FaCar, FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-red-500/30 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <FaGlobe className="w-4 h-4 mr-2" />
                <span className="font-bold">GLOBAL SHIPPING</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-4 h-4 mr-2" />
                <span className="font-bold">24/7 SUPPORT</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-bold">282,078 CARS AVAILABLE</span>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg mr-3">
                <FaCar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">AUTOHUB</div>
                <div className="text-xs text-red-400 font-bold tracking-widest uppercase">DRIVE WHAT'S NEXT</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/find-cars" className="text-white hover:text-red-400 transition-colors font-bold text-sm uppercase tracking-wide">
              Find Cars
            </Link>
            <Link href="/support" className="text-white hover:text-red-400 transition-colors font-bold text-sm uppercase tracking-wide">
              Support
            </Link>
            <Link href="/contact" className="text-white hover:text-red-400 transition-colors font-bold text-sm uppercase tracking-wide">
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <button className="p-3 text-white hover:text-red-400 transition-colors bg-white/10 rounded-lg hover:bg-white/20">
              <FaSearch className="w-5 h-5" />
            </button>
            <button className="p-3 text-white hover:text-red-400 transition-colors bg-white/10 rounded-lg hover:bg-white/20">
              <FaHeart className="w-5 h-5" />
            </button>
            <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 font-black text-sm uppercase tracking-wide shadow-lg">
              <FaUser className="w-4 h-4 inline mr-2" />
              LOG IN
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-3 text-white hover:text-red-400 transition-colors bg-white/10 rounded-lg hover:bg-white/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-red-500/30">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/find-cars" 
                className="text-white hover:text-red-400 py-3 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors font-bold text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Cars
              </Link>
              <Link 
                href="/support" 
                className="text-white hover:text-red-400 py-3 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors font-bold text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <Link 
                href="/contact" 
                className="text-white hover:text-red-400 py-3 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors font-bold text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}