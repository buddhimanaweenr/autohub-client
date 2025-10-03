import Link from 'next/link'
import { FaCar, FaGlobe, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg mr-3">
                <FaCar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">AUTOHUB</div>
                <div className="text-xs text-red-400 font-bold tracking-widest uppercase">DRIVE WHAT'S NEXT</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Your trusted partner for premium used cars from Japan. Global shipping, guaranteed quality, and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-white/10 text-white rounded-lg hover:bg-red-600 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-white/10 text-white rounded-lg hover:bg-red-600 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-white/10 text-white rounded-lg hover:bg-red-600 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-white/10 text-white rounded-lg hover:bg-red-600 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/find-cars" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Find Cars</Link></li>
              <li><Link href="/support" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Support</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Contact</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wide">Services</h3>
            <ul className="space-y-3">
              <li><Link href="/inspection" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Vehicle Inspection</Link></li>
              <li><Link href="/financing" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Financing</Link></li>
              <li><Link href="/insurance" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Insurance</Link></li>
              <li><Link href="/warranty" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Warranty</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wide">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaPhone className="w-4 h-4 text-red-500 mr-3" />
                <span className="text-gray-300 font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="w-4 h-4 text-red-500 mr-3" />
                <span className="text-gray-300 font-medium">info@autohub.com</span>
              </div>
              <div className="flex items-center">
                <FaGlobe className="w-4 h-4 text-red-500 mr-3" />
                <span className="text-gray-300 font-medium">Global Shipping</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-red-500/30 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-4 sm:mb-0">
              <Link href="/terms" className="hover:text-red-400 transition-colors font-medium">Terms of Use</Link>
              <Link href="/privacy" className="hover:text-red-400 transition-colors font-medium">Privacy Policy</Link>
              <Link href="/sitemap" className="hover:text-red-400 transition-colors font-medium">Sitemap</Link>
            </div>
            <div className="text-sm text-gray-400 text-center sm:text-right">
              <p className="font-medium">&copy; 2024 AUTOHUB. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}