'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface LinkStats {
  date: string
  clicks: number
  conversions: number
  earnings: number
}

interface LinkAnalyticsProps {
  linkId: string
  className?: string
}

export default function LinkAnalytics({ linkId, className = '' }: LinkAnalyticsProps) {
  const [stats, setStats] = useState<LinkStats[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/affiliate/links/${linkId}/stats?timeframe=${timeframe}`)
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [linkId, timeframe])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  const chartData = {
    labels: stats.map(stat => stat.date),
    datasets: [
      {
        label: 'Clicks',
        data: stats.map(stat => stat.clicks),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Conversions',
        data: stats.map(stat => stat.conversions),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Earnings ($)',
        data: stats.map(stat => stat.earnings),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Link Performance'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Total Clicks</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.reduce((sum, stat) => sum + stat.clicks, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Total Conversions</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.reduce((sum, stat) => sum + stat.conversions, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Total Earnings</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${stats.reduce((sum, stat) => sum + stat.earnings, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
} 