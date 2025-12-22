'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaWhatsapp, FaComment, FaTimes, FaCheck, FaCar } from 'react-icons/fa'
import { createQuoteRequest } from '@/lib/api'
import type { Vehicle, QuoteRequestData } from '@/lib/api'
import { getMakeLabel } from '@/lib/constants/vehicleMakes'

interface QuoteFormData {
  fullName: string
  emailAddress: string
  phoneNumber: string
  whatsappNumber: string
  remarks: string
}

interface QuoteRequestWidgetProps {
  vehicle?: Vehicle
  onClose?: () => void
}

export default function QuoteRequestWidget({ vehicle, onClose }: QuoteRequestWidgetProps) {
  const formatPrice = (price: string | number | undefined): string => {
    if (!price) return 'N/A'
    if (typeof price === 'string') return price
    return `$${price.toLocaleString()}`
  }

  const vehicleName = vehicle 
    ? `${vehicle.make ? getMakeLabel(vehicle.make) : ''} ${vehicle.model || ''} ${vehicle.year || ''}`.trim() || 'Vehicle'
    : 'Vehicle'
  
  const vehiclePrice = vehicle ? formatPrice(vehicle.price || vehicle.sellingPrice) : 'N/A'

  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    whatsappNumber: '',
    remarks: vehicle ? `${vehicle.make ? getMakeLabel(vehicle.make) : ''} ${vehicle.model || ''} ${vehicle.year || ''}`.trim() : ''
  })
  
  const [errors, setErrors] = useState<Partial<QuoteFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    setSubmitError(null)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<QuoteFormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required'
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required'
    }

    if (!formData.remarks.trim()) {
      newErrors.remarks = 'Remarks are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhoneNumber = (phone: string): string => {
    // Remove the first 0 if present
    if (phone.startsWith('0')) {
      return phone.substring(1)
    }
    return phone
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!vehicle) {
      setSubmitError('Vehicle information is required')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const quoteData: QuoteRequestData = {
        vehicleId: vehicle.id?.toString() || vehicle._id?.toString() || '',
        fullName: formData.fullName.trim(),
        emailAddress: formData.emailAddress.trim(),
        phoneNumber: formatPhoneNumber(formData.phoneNumber),
        remarks: formData.remarks.trim(),
        ...(formData.whatsappNumber && { whatsappNumber: formatPhoneNumber(formData.whatsappNumber) }),
      }

      await createQuoteRequest(quoteData)
      setSubmitSuccess(true)
      
      // Auto-close after 3 seconds
      if (onClose) {
        setTimeout(() => {
          onClose()
        }, 3000)
      }
    } catch (error) {
      console.error('Error submitting quote request:', error)
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit quote request. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            We've received your quote request and will contact you shortly with pricing information.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Total Price</h2>
          <p className="text-gray-600 text-sm mt-1">Get an estimate by completing this form.</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{submitError}</p>
          </div>
        )}

        {/* Selected Vehicle */}
        {vehicle && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Selected Vehicle</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <FaCar className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{vehicleName}</p>
                <p className="text-primary-600 font-bold">{vehiclePrice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="--"
              required
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.emailAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              required
            />
          </div>
          {errors.emailAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.emailAddress}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">The first 0 will be omitted</p>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp
          </label>
          <div className="relative">
            <FaWhatsapp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your WhatsApp number"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaComment className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                errors.remarks ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Enter your remarks"
              required
            />
          </div>
          {errors.remarks && (
            <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            isSubmitting
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  )
}

