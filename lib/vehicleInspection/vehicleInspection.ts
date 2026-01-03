import { getAuthHeaders, clearToken } from '../auth'
import { VehicleInspectionRequest, VehicleInspectionResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

/**
 * Submits a vehicle inspection booking request
 */
export async function createVehicleInspection(
  inspectionData: VehicleInspectionRequest
): Promise<VehicleInspectionResponse> {
  try {
    // Ensure we're authenticated before making the request
    const headers = await getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}/vehicle-inspection/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(inspectionData),
    })

    // If unauthorized, try to re-authenticate once
    if (response.status === 401) {
      clearToken()
      const newHeaders = await getAuthHeaders()
      const retryResponse = await fetch(`${API_BASE_URL}/vehicle-inspection/`, {
        method: 'POST',
        headers: newHeaders,
        body: JSON.stringify(inspectionData),
      })
      
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}))
        throw new Error(
          errorData.message || 
          `Failed to create vehicle inspection: ${retryResponse.statusText}`
        )
      }
      
      const data: VehicleInspectionResponse = await retryResponse.json()
      return data
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || 
        `Failed to create vehicle inspection: ${response.statusText}`
      )
    }

    const data: VehicleInspectionResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error creating vehicle inspection:', error)
    throw error
  }
}



