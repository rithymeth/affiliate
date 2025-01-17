'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface LinkStats {
  id: string
  name: string
  clicks: number
  conversions: number
  earnings: number
  ctr: number
}

export default function LinkAnalytics({ linkId }: { linkId: string }) {
  const [timeframe, setTimeframe] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<LinkStats[]>([])

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      clicks: Math.floor(Math.random() * 100),
      conversions: Math.floor(Math.random() * 20),
      earnings: Math.random() * 200,
    })).reverse()

    setStats(mockData)
    setLoading(false)
  }, [linkId, timeframe])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-[400px] bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Link Performance</h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280' }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            />
            <YAxis yAxisId="left" tick={{ fill: '#6B7280' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6B7280' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="clicks"
              name="Clicks"
              stroke="#6366F1"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="conversions"
              name="Conversions"
              stroke="#10B981"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="earnings"
              name="Earnings"
              stroke="#F59E0B"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { label: 'Total Clicks', value: stats.reduce((sum, day) => sum + day.clicks, 0) },
          { label: 'Total Conversions', value: stats.reduce((sum, day) => sum + day.conversions, 0) },
          { label: 'Total Earnings', value: `$${stats.reduce((sum, day) => sum + day.earnings, 0).toFixed(2)}` },
        ].map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 