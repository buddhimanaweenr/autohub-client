'use client'

import { useState, useEffect } from 'react'
import { fetchQuoteRequests } from '@/lib/admin/api'
import type { QuoteRequestListItem } from '@/lib/admin/api'

export default function QuoteRequestsView() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadQuoteRequests()
  }, [])

  const loadQuoteRequests = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchQuoteRequests()
      setQuoteRequests(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load quote requests')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-gray-600">Loading quote requests...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">{error}</div>
        <button
          onClick={loadQuoteRequests}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Quote Requests</h2>
        <button
          onClick={loadQuoteRequests}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>

      {quoteRequests.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No quote requests found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {quoteRequests.map((request) => (
              <li key={request._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.fullName}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500">
                        (Vehicle ID: {request.vehicleId})
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {request.emailAddress}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {request.phoneNumber || 'N/A'}
                      </p>
                      {request.whatsappNumber && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">WhatsApp:</span> {request.whatsappNumber}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Remarks:</span> {request.remarks || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {formatDate(request.createdDateTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

