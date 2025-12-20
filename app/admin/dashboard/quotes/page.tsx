import QuoteRequestsView from '@/components/admin/QuoteRequestsView'

export default function QuoteRequestsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote Requests</h1>
        <p className="text-gray-600">Manage customer quote requests</p>
      </div>
      <QuoteRequestsView />
    </div>
  )
}

