export interface Vehicle {
  // Support both API field names (_id) and normalized names (id)
  id?: number | string
  _id?: string
  make?: string
  model?: string
  year?: number | string
  // Support both API field names (sellingPrice) and normalized names (price)
  price?: string | number
  sellingPrice?: number
  mileage?: string | number
  images?: string[]
  image?: string
  transmission?: string
  fuelType?: string
  color?: string
  engine?: string
  drivetrain?: string
  description?: string
  isActive?: boolean
  createdDateTime?: string
  updatedDateTime?: string
  [key: string]: any // Allow additional properties from API
}

