import InspectionCalendarView from '@/components/admin/InspectionCalendarView'

export default function InspectionCalendarPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inspection Calendar</h1>
        <p className="text-gray-600">View inspections scheduled on calendar</p>
      </div>
      <InspectionCalendarView />
    </div>
  )
}

