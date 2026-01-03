export interface VehicleInspectionRequest {
  vehicleId: string
  preferredDate: string
  preferredTime: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  inspectionLocation?: string
  inspectionType?: string
  specialRequests?: string
}

export interface VehicleInspectionResponse {
  message?: string
  status?: string
  result?: {
    _id?: string
    vehicleId: string
    preferredDate: string
    preferredTime: string
    fullName: string
    emailAddress: string
    phoneNumber: string
    inspectionLocation?: string
    inspectionType?: string
    specialRequests?: string
    [key: string]: any
  }
  [key: string]: any
}



