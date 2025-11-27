/**
 * Main API module - re-exports all API functions for backward compatibility
 * 
 * For better organization, you can import directly from:
 * - @/lib/vehicle for vehicle-related functions
 * - @/lib/vehicleInspection for inspection-related functions
 * - @/lib/quoteRequest for quote request functions
 * - @/lib/auth for authentication functions
 */

// Re-export vehicle functions and types
export * from './vehicle'

// Re-export vehicle inspection functions and types
export * from './vehicleInspection'

// Re-export quote request functions and types
export * from './quoteRequest'

// Re-export auth functions (for advanced usage)
export * from './auth'
