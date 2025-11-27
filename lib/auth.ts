const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

// Authentication credentials - stored in environment variables or use defaults
const AUTH_USERNAME = process.env.NEXT_PUBLIC_AUTH_USERNAME || 'buddhimanaween'
const AUTH_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || 'buddhima@123'

// Token storage key for localStorage
const TOKEN_STORAGE_KEY = 'vehicle_api_token'

export interface AuthResponse {
  message: string
  status: string
  results: {
    accessToken: string
    user: {
      _id: string
      fullName: string
      userName: string
      userEmail: string
      exp: number
    }
  }
}

// In-memory token storage (fallback if localStorage is not available)
let cachedToken: string | null = null

/**
 * Gets the stored access token
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || cachedToken
    } catch (error) {
      console.warn('localStorage not available, using in-memory token')
      return cachedToken
    }
  }
  return cachedToken
}

/**
 * Stores the access token
 */
export function setToken(token: string): void {
  cachedToken = token
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } catch (error) {
      console.warn('Could not store token in localStorage', error)
    }
  }
}

/**
 * Clears the stored access token
 */
export function clearToken(): void {
  cachedToken = null
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    } catch (error) {
      console.warn('Could not clear token from localStorage', error)
    }
  }
}

/**
 * Authenticates with the API and retrieves an access token
 */
export async function login(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: AUTH_USERNAME,
        password: AUTH_PASSWORD,
      }),
    })

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`)
    }

    const data: AuthResponse = await response.json()
    
    if (data.status === 'Success' && data.results?.accessToken) {
      const token = data.results.accessToken
      setToken(token)
      return token
    } else {
      throw new Error('Invalid authentication response format')
    }
  } catch (error) {
    console.error('Error during authentication:', error)
    clearToken()
    throw error
  }
}

/**
 * Ensures we have a valid token, authenticating if necessary
 */
export async function ensureAuthenticated(): Promise<string> {
  let token = getToken()
  
  // If no token, authenticate
  if (!token) {
    token = await login()
  }
  
  return token
}

/**
 * Gets request headers with authentication token
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await ensureAuthenticated()
  
  return {
    'Content-Type': 'application/json',
    'tokenid': token,
  }
}


