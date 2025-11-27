const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

// Admin token storage key for localStorage
const ADMIN_TOKEN_STORAGE_KEY = 'admin_api_token'
const ADMIN_USER_STORAGE_KEY = 'admin_user'

export interface AdminAuthResponse {
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

export interface AdminUser {
  _id: string
  fullName: string
  userName: string
  userEmail: string
  exp: number
}

// In-memory token storage (fallback if localStorage is not available)
let cachedAdminToken: string | null = null
let cachedAdminUser: AdminUser | null = null

/**
 * Gets the stored admin access token
 */
export function getAdminToken(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || cachedAdminToken
    } catch (error) {
      console.warn('localStorage not available, using in-memory token')
      return cachedAdminToken
    }
  }
  return cachedAdminToken
}

/**
 * Gets the stored admin user
 */
export function getAdminUser(): AdminUser | null {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem(ADMIN_USER_STORAGE_KEY)
      if (userStr) {
        return JSON.parse(userStr)
      }
      return cachedAdminUser
    } catch (error) {
      console.warn('localStorage not available, using in-memory user')
      return cachedAdminUser
    }
  }
  return cachedAdminUser
}

/**
 * Stores the admin access token and user
 */
export function setAdminToken(token: string, user: AdminUser): void {
  cachedAdminToken = token
  cachedAdminUser = user
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token)
      localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(user))
    } catch (error) {
      console.warn('Could not store admin token in localStorage', error)
    }
  }
}

/**
 * Clears the stored admin access token and user
 */
export function clearAdminToken(): void {
  cachedAdminToken = null
  cachedAdminUser = null
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
      localStorage.removeItem(ADMIN_USER_STORAGE_KEY)
    } catch (error) {
      console.warn('Could not clear admin token from localStorage', error)
    }
  }
}

/**
 * Authenticates admin with the API and retrieves an access token
 */
export async function adminLogin(
  userName: string,
  password: string
): Promise<{ token: string; user: AdminUser }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`)
    }

    const data: AdminAuthResponse = await response.json()
    
    if (data.status === 'Success' && data.results?.accessToken) {
      const token = data.results.accessToken
      const user = data.results.user
      setAdminToken(token, user)
      return { token, user }
    } else {
      throw new Error('Invalid authentication response format')
    }
  } catch (error) {
    console.error('Error during admin authentication:', error)
    clearAdminToken()
    throw error
  }
}

/**
 * Gets request headers with admin authentication token
 */
export function getAdminAuthHeaders(): HeadersInit {
  const token = getAdminToken()
  
  if (!token) {
    throw new Error('Admin not authenticated')
  }
  
  return {
    'Content-Type': 'application/json',
    'tokenid': token,
  }
}

/**
 * Checks if admin is authenticated
 */
export function isAdminAuthenticated(): boolean {
  const token = getAdminToken()
  if (!token) return false
  
  // Check if token is expired
  const user = getAdminUser()
  if (user && user.exp) {
    const expirationTime = user.exp * 1000 // Convert to milliseconds
    if (Date.now() >= expirationTime) {
      clearAdminToken()
      return false
    }
  }
  
  return true
}

