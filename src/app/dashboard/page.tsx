'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useState, useEffect } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

interface Stats {
  totalClicks: number
  totalEarnings: number
  conversionRate: number
  activeLinks: number
}

const defaultStats: Stats = {
  totalClicks: 0,
  totalEarnings: 0,
  conversionRate: 0,
  activeLinks: 0
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [chartData, setChartData] = useState<any[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data.stats)
        setChartData(data.chartData)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    if (!loading && user) {
      fetchStats()
    }
  }, [loading, user])

  if (loading || statsLoading) {
    return <LoadingSpinner />
  }

  const stats_cards = [
    {
      name: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      change: '+12.5%',
      changeType: 'increase',
      icon: ChartBarIcon,
    },
    {
      name: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      change: '+8.2%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: '-1.5%',
      changeType: 'decrease',
      icon: UsersIcon,
    },
    {
      name: 'Active Links',
      value: stats.activeLinks.toString(),
      change: '+3',
      changeType: 'increase',
      icon: LinkIcon,
    },
  ]

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        
        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats_cards.map((stat) => (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <stat.icon className="h-5 w-5 text-gray-400" />
                  {stat.name}
                </div>
              </dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-primary-600">
                  {stat.value}
                </div>

                <div className={`inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0
                  ${stat.changeType === 'increase' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}
                >
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center text-red-500" />
                  )}
                  <span className="ml-1">{stat.change}</span>
                </div>
              </dd>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="mt-8">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Performance Overview</h3>
              <div className="mt-2 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stackId="1" 
                      stroke="#0EA5E9" 
                      fill="#0EA5E9" 
                      fillOpacity={0.2} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="clicks" 
                      stackId="2" 
                      stroke="#6366F1" 
                      fill="#6366F1" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 