'use client'

import { useEffect, useState } from 'react'
import { fetchQuoteRequests, fetchVehicleInspections } from '@/lib/admin/api'
import { FaFileInvoice, FaCalendarCheck, FaCar, FaChartLine } from 'react-icons/fa'

export default function DashboardStats() {
  const [stats, setStats] = useState({
    quotes: 0,
    inspections: 0,
    loading: true
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [quotes, inspections] = await Promise.all([
        fetchQuoteRequests().catch(() => []),
        fetchVehicleInspections().catch(() => [])
      ])
      setStats({
        quotes: quotes.length,
        inspections: inspections.length,
        loading: false
      })
    } catch (error) {
      setStats({ quotes: 0, inspections: 0, loading: false })
    }
  }

  const statCards = [
    {
      title: 'Quote Requests',
      value: stats.loading ? '...' : stats.quotes,
      icon: FaFileInvoice,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Vehicle Inspections',
      value: stats.loading ? '...' : stats.inspections,
      icon: FaCalendarCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Actions',
      value: stats.loading ? '...' : stats.quotes + stats.inspections,
      icon: FaChartLine,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Requests',
      value: stats.loading ? '...' : stats.quotes + stats.inspections,
      icon: FaCar,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

