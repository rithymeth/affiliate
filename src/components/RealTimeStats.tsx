'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline'

interface Stats {
  clicks: number
  earnings: number
  conversions: number
}

export default function RealTimeStats({ affiliateId }: { affiliateId: string }) {
  const [stats, setStats] = useState<Stats>({
    clicks: 0,
    earnings: 0,
    conversions: 0,
  })

  useEffect(() => {
    const sse = new EventSource(`/api/affiliate/events`, {
      withCredentials: true,
    })

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'update') {
          setStats({
            clicks: data.data.clicks,
            earnings: data.data.earnings.reduce((sum: number, e: any) => sum + e.amount, 0),
            conversions: data.data.clicks * 0.1, // Example conversion rate
          })
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }

    return () => {
      sse.close()
    }
  }, [affiliateId])

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
      {[
        { label: 'Today\'s Clicks', value: stats.clicks, icon: UserGroupIcon },
        { label: 'Today\'s Earnings', value: `$${stats.earnings.toFixed(2)}`, icon: CurrencyDollarIcon },
        { label: 'Conversions', value: stats.conversions, icon: ChartBarIcon },
      ].map((stat, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.label}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 