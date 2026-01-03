'use client'

import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { createVehicleInspection } from '@/lib/api'
import type { Vehicle } from '@/lib/api'
import { getMakeLabel } from '@/lib/constants/vehicleMakes'

interface BookingData {
  carId: string
  carName: string
  carPrice: string
  customerName: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  location: string
  inspectionType: string
  paymentMethod: string
  specialRequests: string
}

interface BookingWidgetProps {
  vehicle?: Vehicle
  onClose?: () => void
}

export default function BookingWidget({ vehicle, onClose }: BookingWidgetProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<{ preferredDate?: string; preferredTime?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const formatPrice = (price: string | number | undefined): string => {
    if (!price) return 'N/A'
    if (typeof price === 'string') return price
    return `$${price.toLocaleString()}`
  }

  const [bookingData, setBookingData] = useState<BookingData>({
    carId: '',
    carName: '',
    carPrice: '',
    customerName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    inspectionType: '',
    paymentMethod: '',
    specialRequests: ''
  })

  // Update booking data when vehicle prop changes
  useEffect(() => {
    if (vehicle) {
      const vehicleName = `${vehicle.make ? getMakeLabel(vehicle.make) : ''} ${vehicle.model || ''} ${vehicle.year || ''}`.trim() || 'Vehicle'
      // Use id or _id (API returns _id, but we normalize it to id)
      const vehicleId = vehicle.id?.toString() || vehicle._id?.toString() || ''
      setBookingData(prev => ({
        ...prev,
        carId: vehicleId,
        carName: vehicleName,
        carPrice: formatPrice(vehicle.price || vehicle.sellingPrice),
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle])

  const steps = [
    { number: 1, title: 'Vehicle Details', icon: FaCalendarAlt },
    { number: 2, title: 'Contact Information', icon: FaUser },
    { number: 3, title: 'Inspection & Location', icon: FaMapMarkerAlt },
    { number: 4, title: 'Review', icon: FaCheck }
  ]

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ]

  const inspectionTypes = [
    'Basic Inspection',
    'Comprehensive Inspection',
    'Pre-Purchase Inspection',
    'Export Inspection'
  ]


  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing/selecting
    if (field === 'preferredDate' || field === 'preferredTime') {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateInspectionDateTime = (): boolean => {
    const newErrors: { preferredDate?: string; preferredTime?: string } = {}
    
    if (!bookingData.preferredDate || bookingData.preferredDate.trim() === '') {
      newErrors.preferredDate = 'Preferred Date is required'
    }
    
    if (!bookingData.preferredTime || bookingData.preferredTime.trim() === '') {
      newErrors.preferredTime = 'Preferred Time is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    // Validate inspection date and time when leaving step 1
    if (currentStep === 1) {
      if (!validateInspectionDateTime()) {
        return // Don't proceed if validation fails
      }
    }
    
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    // Validate inspection date and time before submission
    if (!validateInspectionDateTime()) {
      // If validation fails, go back to step 1 to show errors
      setCurrentStep(1)
      return
    }

    // Validate required fields
    if (!bookingData.customerName.trim()) {
      setSubmitError('Full name is required')
      setCurrentStep(2)
      return
    }

    if (!bookingData.email.trim()) {
      setSubmitError('Email address is required')
      setCurrentStep(2)
      return
    }

    if (!bookingData.phone.trim()) {
      setSubmitError('Phone number is required')
      setCurrentStep(2)
      return
    }

    if (!bookingData.carId) {
      setSubmitError('Vehicle ID is required')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Map booking data to API format
      const inspectionData = {
        vehicleId: bookingData.carId,
        preferredDate: bookingData.preferredDate,
        preferredTime: bookingData.preferredTime,
        fullName: bookingData.customerName,
        emailAddress: bookingData.email,
        phoneNumber: bookingData.phone,
        inspectionLocation: bookingData.location || undefined,
        inspectionType: bookingData.inspectionType || undefined,
        specialRequests: bookingData.specialRequests || undefined,
      }

      await createVehicleInspection(inspectionData)
      setSubmitSuccess(true)
      
      // Optionally close the widget after a delay
      if (onClose) {
        setTimeout(() => {
          onClose()
        }, 3000)
      }
    } catch (error) {
      console.error('Error submitting inspection:', error)
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit inspection booking. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Selected Vehicle</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{bookingData.carName}</p>
                  <p className="text-primary-600 font-bold">{bookingData.carPrice}</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                value={bookingData.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.preferredDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              {errors.preferredDate && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleInputChange('preferredTime', time)}
                    className={`p-2 text-sm rounded-lg border ${
                      bookingData.preferredTime === time
                        ? 'bg-primary-600 text-white border-primary-600'
                        : errors.preferredTime
                        ? 'bg-white text-gray-700 border-red-500 hover:border-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {errors.preferredTime && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredTime}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={bookingData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={bookingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={bookingData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspection Location
              </label>
              <input
                type="text"
                value={bookingData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter inspection location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspection Type
              </label>
              <select
                value={bookingData.inspectionType}
                onChange={(e) => handleInputChange('inspectionType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select inspection type</option>
                {inspectionTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Any special requests or requirements..."
              />
            </div>
          </div>
        )

      case 4:
        if (submitSuccess) {
          return (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <FaCheck className="w-16 h-16 text-green-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Booking Confirmed!</h3>
                <p className="text-green-800 mb-4">
                  Your vehicle inspection booking has been submitted successfully.
                </p>
                <p className="text-sm text-green-700">
                  We'll contact you within 24 hours to confirm the details.
                </p>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            )}
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{bookingData.carName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-primary-600">{bookingData.carPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{bookingData.preferredDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{bookingData.preferredTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{bookingData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{bookingData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{bookingData.phone}</span>
                </div>
                {bookingData.inspectionType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inspection:</span>
                    <span className="font-medium">{bookingData.inspectionType}</span>
                  </div>
                )}
                {bookingData.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{bookingData.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We'll contact you within 24 hours</li>
                <li>• Inspection will be scheduled at your preferred time</li>
                <li>• After inspection, we'll provide you with a detailed report</li>
                <li>• Vehicle will be prepared for shipping upon approval</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Vehicle Inspection</h2>
        <p className="text-gray-600">Complete your booking in 4 simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number
            
            return (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? <FaCheck className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${
                  isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center px-4 py-2 rounded-lg ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Next
            <FaArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || submitSuccess}
            className={`flex items-center px-6 py-2 rounded-lg ${
              isSubmitting || submitSuccess
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : submitSuccess ? (
              <>
                <FaCheck className="w-4 h-4 mr-2" />
                Submitted
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4 mr-2" />
                Confirm Booking
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
