'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface ReportData {
  dailyClicks: {
    date: string
    clicks: number
  }[]
  conversionsBySource: {
    source: string
    count: number
  }[]
  topLinks: {
    url: string
    clicks: number
    conversions: number
    earnings: number
  }[]
  performance: {
    totalClicks: number
    totalConversions: number
    conversionRate: number
    totalEarnings: number
    averageOrderValue: number
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ReportsPage() {
  const { user } = useAuth()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState('30d') // 7d, 30d, 90d

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(`/api/reports?range=${dateRange}`)
        if (!response.ok) throw new Error('Failed to fetch report data')
        const data = await response.json()
        setReportData(data)
      } catch (error) {
        console.error('Error fetching report data:', error)
        setError('Failed to load report data')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchReportData()
    }
  }, [user, dateRange])

  if (loading) return <LoadingSpinner />

  if (!reportData) return null

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  dateRange === range
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Total Clicks', value: reportData.performance.totalClicks },
            { label: 'Total Conversions', value: reportData.performance.totalConversions },
            { 
              label: 'Conversion Rate', 
              value: `${reportData.performance.conversionRate.toFixed(2)}%` 
            },
            { 
              label: 'Total Earnings', 
              value: `$${reportData.performance.totalEarnings.toFixed(2)}` 
            },
            { 
              label: 'Avg. Order Value', 
              value: `$${reportData.performance.averageOrderValue.toFixed(2)}` 
            },
          ].map((metric) => (
            <div key={metric.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {metric.label}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metric.value}
                </dd>
              </div>
            </div>
          ))}
        </div>

        {/* Clicks Over Time Chart */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Clicks Over Time</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData.dailyClicks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#0EA5E9" 
                    fill="#0EA5E9" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Conversions by Source */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Conversions by Source
              </h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.conversionsBySource}
                      dataKey="count"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {reportData.conversionsBySource.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Performing Links */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Top Performing Links
              </h3>
              <div className="mt-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">URL</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Clicks</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Conv.</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Earnings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.topLinks.map((link) => (
                          <tr key={link.url}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                              {link.url}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {link.clicks}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {link.conversions}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              ${link.earnings.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 