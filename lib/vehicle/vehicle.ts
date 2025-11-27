import { getAuthHeaders, clearToken } from '../auth'
import { Vehicle } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

/**
 * Normalizes a vehicle object from API to match Vehicle interface
 * Maps _id to id and sellingPrice to price for backward compatibility
 */
function normalizeVehicle(vehicle: any): Vehicle {
  if (!vehicle) return vehicle
  
  const normalized: Vehicle = { ...vehicle }
  
  // Map _id to id if _id exists and id doesn't
  if (vehicle._id && !normalized.id) {
    normalized.id = vehicle._id
  }
  
  // Map sellingPrice to price if sellingPrice exists and price doesn't
  if (vehicle.sellingPrice !== undefined && normalized.price === undefined) {
    normalized.price = vehicle.sellingPrice
  }
  
  return normalized
}

/**
 * Helper function to parse vehicle response in different formats
 */
function parseVehicleResponse(data: any): Vehicle[] {
  let vehicles: any[] = []
  
  // Handle different API response formats
  // If the API returns an array directly, return it
  if (Array.isArray(data)) {
    vehicles = data
  }
  // If the API returns an object with a results or data property
  else if (data.results && Array.isArray(data.results)) {
    vehicles = data.results
  }
  else if (data.data && Array.isArray(data.data)) {
    vehicles = data.data
  }
  // If it's a single vehicle, wrap it in an array
  else {
    vehicles = [data]
  }
  
  // Normalize all vehicles
  return vehicles.map(normalizeVehicle)
}

/**
 * Fetches all vehicles from the API
 */
export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    // Ensure we're authenticated before making the request
    const headers = await getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}/vehicle/`, {
      method: 'GET',
      headers,
    })

    // If unauthorized, try to re-authenticate once
    if (response.status === 401) {
      clearToken()
      const newHeaders = await getAuthHeaders()
      const retryResponse = await fetch(`${API_BASE_URL}/vehicle/`, {
        method: 'GET',
        headers: newHeaders,
      })
      
      if (!retryResponse.ok) {
        throw new Error(`Failed to fetch vehicles: ${retryResponse.statusText}`)
      }
      
      const data = await retryResponse.json()
      return parseVehicleResponse(data)
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`)
    }

    const data = await response.json()
    return parseVehicleResponse(data)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    throw error
  }
}

/**
 * Fetches a single vehicle by ID from the API
 */
export async function fetchVehicleById(id: string | number): Promise<Vehicle> {
  try {
    // Ensure we're authenticated before making the request
    const headers = await getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}/vehicle/${id}/`, {
      method: 'GET',
      headers,
    })

    // If unauthorized, try to re-authenticate once
    if (response.status === 401) {
      clearToken()
      const newHeaders = await getAuthHeaders()
      const retryResponse = await fetch(`${API_BASE_URL}/vehicle/${id}/`, {
        method: 'GET',
        headers: newHeaders,
      })
      
      if (!retryResponse.ok) {
        if (retryResponse.status === 404) {
          throw new Error(`Vehicle with id ${id} not found`)
        }
        throw new Error(`Failed to fetch vehicle: ${retryResponse.statusText}`)
      }
      
      const data = await retryResponse.json()
      // Normalize the vehicle data to map _id to id and sellingPrice to price
      return normalizeVehicle(data.result)
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Vehicle with id ${id} not found`)
      }
      throw new Error(`Failed to fetch vehicle: ${response.statusText}`)
    }

    const data = await response.json()
    // Normalize the vehicle data to map _id to id and sellingPrice to price
    return normalizeVehicle(data.result)
  } catch (error) {
    console.error(`Error fetching vehicle ${id}:`, error)
    throw error
  }
}

