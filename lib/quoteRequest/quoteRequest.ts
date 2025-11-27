import { getAuthHeaders, clearToken } from '../auth'
import { QuoteRequestData, QuoteRequestResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

/**
 * Submits a quote request for a vehicle
 */
export async function createQuoteRequest(
  quoteData: QuoteRequestData
): Promise<QuoteRequestResponse> {
  try {
    // Ensure we're authenticated before making the request
    const headers = await getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}/quote`, {
      method: 'POST',
      headers,
      body: JSON.stringify(quoteData),
    })

    // If unauthorized, try to re-authenticate once
    if (response.status === 401) {
      clearToken()
      const newHeaders = await getAuthHeaders()
      const retryResponse = await fetch(`${API_BASE_URL}/quote`, {
        method: 'POST',
        headers: newHeaders,
        body: JSON.stringify(quoteData),
      })
      
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}))
        throw new Error(
          errorData.message || 
          `Failed to create quote request: ${retryResponse.statusText}`
        )
      }
      
      const data: QuoteRequestResponse = await retryResponse.json()
      return data
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || 
        `Failed to create quote request: ${response.statusText}`
      )
    }

    const data: QuoteRequestResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error creating quote request:', error)
    throw error
  }
}

