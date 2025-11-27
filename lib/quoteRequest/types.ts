export interface QuoteRequestData {
  vehicleId: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  whatsappNumber?: string
  remarks: string
}

export interface QuoteRequestResponse {
  message?: string
  status?: string
  result?: {
    _id?: string
    vehicleId: string
    fullName: string
    emailAddress: string
    phoneNumber?: string
    whatsappNumber?: string
    remarks: string
    [key: string]: any
  }
  [key: string]: any
}

