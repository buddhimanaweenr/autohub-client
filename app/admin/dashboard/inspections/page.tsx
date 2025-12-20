import VehicleInspectionsView from '@/components/admin/VehicleInspectionsView'

export default function VehicleInspectionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Inspections</h1>
        <p className="text-gray-600">Manage vehicle inspection requests</p>
      </div>
      <VehicleInspectionsView />
    </div>
  )
}

