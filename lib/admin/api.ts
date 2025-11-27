import { getAdminAuthHeaders, clearAdminToken } from './auth'
import { Vehicle } from '../vehicle/types'
import { QuoteRequestData } from '../quoteRequest/types'
import { VehicleInspectionRequest } from '../vehicleInspection/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

// Quote Request Types
export interface QuoteRequestListItem {
  _id: string
  vehicleId: string
  fullName: string
  emailAddress: string
  phoneNumber?: string
  whatsappNumber?: string
  remarks: string
  createdDateTime?: string
  updatedDateTime?: string
  [key: string]: any
}

export interface QuoteRequestsResponse {
  message?: string
  status?: string
  results?: QuoteRequestListItem[]
  data?: QuoteRequestListItem[]
  [key: string]: any
}

// Vehicle Inspection Types
export interface VehicleInspectionListItem {
  _id: string
  vehicleId: string
  preferredDate: string
  preferredTime: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  inspectionLocation?: string
  inspectionType?: string
  specialRequests?: string
  createdDateTime?: string
  updatedDateTime?: string
  [key: string]: any
}

export interface VehicleInspectionsResponse {
  message?: string
  status?: string
  results?: VehicleInspectionListItem[]
  data?: VehicleInspectionListItem[]
  [key: string]: any
}

// Vehicle Creation Types
export interface CreateVehicleData {
  make: string
  model: string
  year: number | string
  sellingPrice: number | string
  mileage?: string | number
  images?: string[]
  transmission?: string
  fuelType?: string
  color?: string
  engine?: string
  drivetrain?: string
  description?: string
  isActive?: boolean
  [key: string]: any
}

export interface CreateVehicleResponse {
  message?: string
  status?: string
  result?: Vehicle
  [key: string]: any
}

/**
 * Fetches all quote requests
 */
export async function fetchQuoteRequests(): Promise<QuoteRequestListItem[]> {
  try {
    const headers = getAdminAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}/quote/`, {
      method: 'GET',
      headers,
    })

    // If unauthorized, clear token and throw error
    if (response.status === 401) {
      clearAdminToken()
      throw new Error('Admin authentication expired. Please login again.')
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch quote requests: ${response.statusText}`)
    }

    const data: QuoteRequestsResponse = await response.json()
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data
    } else if (data.results && Array.isArray(data.results)) {
      return data.results
    } else if (data.data && Array.isArray(data.data)) {
      return data.data
    }
    
    return []
  } catch (error) {
    console.error('Error fetching quote requests:', error)
    throw error
  }
}

/**
 * Fetches all vehicle inspection requests
 */
export async function fetchVehicleInspections(): Promise<VehicleInspectionListItem[]> {
  try {
    const headers = getAdminAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}/vehicle-inspection/`, {
      method: 'GET',
      headers,
    })

    // If unauthorized, clear token and throw error
    if (response.status === 401) {
      clearAdminToken()
      throw new Error('Admin authentication expired. Please login again.')
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle inspections: ${response.statusText}`)
    }

    const data: VehicleInspectionsResponse = await response.json()
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data
    } else if (data.results && Array.isArray(data.results)) {
      return data.results
    } else if (data.data && Array.isArray(data.data)) {
      return data.data
    }
    
    return []
  } catch (error) {
    console.error('Error fetching vehicle inspections:', error)
    throw error
  }
}

/**
 * Creates a new vehicle
 */
export async function createVehicle(
  vehicleData: CreateVehicleData
): Promise<Vehicle> {
  try {
    const headers = getAdminAuthHeaders()

    console.log(vehicleData)
    
    const response = await fetch(`${API_BASE_URL}/vehicle/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(vehicleData),
    })

    // If unauthorized, clear token and throw error
    if (response.status === 401) {
      clearAdminToken()
      throw new Error('Admin authentication expired. Please login again.')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || 
        `Failed to create vehicle: ${response.statusText}`
      )
    }

    const data: CreateVehicleResponse = await response.json()
    
    // Handle different response formats
    if (data.result) {
      return data.result
    } else if (data.results) {
      return data.results
    } else {
      return data as Vehicle
    }
  } catch (error) {
    console.error('Error creating vehicle:', error)
    throw error
  }
}

