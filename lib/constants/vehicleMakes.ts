// Vehicle makes list - shared across components
export const VEHICLE_MAKES = [
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
  { value: 'nissan', label: 'Nissan' },
  { value: 'mazda', label: 'Mazda' },
  { value: 'suzuki', label: 'Suzuki' },
  { value: 'mitsubishi', label: 'Mitsubishi' },
  { value: 'daihatsu', label: 'Daihatsu' },
  { value: 'subaru', label: 'Subaru' },
  { value: 'volkswagen', label: 'Volkswagen' },
  { value: 'bmw', label: 'BMW' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'audi', label: 'Audi' },
  { value: 'lexus', label: 'Lexus' },
  { value: 'landrover', label: 'Land Rover' },
  { value: 'ford', label: 'Ford' },
  { value: 'peugeot', label: 'Peugeot' },
  { value: 'jeep', label: 'Jeep' },
  { value: 'jaguar', label: 'Jaguar' },
  { value: 'hyundai', label: 'Hyundai' },
  { value: 'kia', label: 'Kia' }
]

// Helper function to get make label from value
export function getMakeLabel(value: string): string {
  const make = VEHICLE_MAKES.find(m => m.value === value)
  return make ? make.label : value
}

// Helper function to get make value from label
export function getMakeValue(label: string): string {
  const make = VEHICLE_MAKES.find(m => m.label.toLowerCase() === label.toLowerCase())
  return make ? make.value : label.toLowerCase().replace(/\s+/g, '')
}

