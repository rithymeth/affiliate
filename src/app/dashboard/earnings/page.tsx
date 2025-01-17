'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface Earning {
  id: string
  amount: number
  status: string
  source: string
  createdAt: string
}

export default function EarningsPage() {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch('/api/earnings')
        if (!response.ok) throw new Error('Failed to fetch earnings')
        const data = await response.json()
        setEarnings(data)
      } catch (error) {
        console.error('Error fetching earnings:', error)
        setError('Failed to load earnings')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchEarnings()
    }
  }, [user])

  if (loading) return <LoadingSpinner />

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0)
  const pendingEarnings = earnings
    .filter(e => e.status === 'pending')
    .reduce((sum, earning) => sum + earning.amount, 0)

  // Group earnings by month for chart
  const monthlyEarnings = earnings.reduce((acc, earning) => {
    const month = new Date(earning.createdAt).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + earning.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(monthlyEarnings).map(([month, amount]) => ({
    month,
    amount
  }))

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Earnings</h1>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Earnings
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-primary-600">
                ${totalEarnings.toFixed(2)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Pending Earnings
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                ${pendingEarnings.toFixed(2)}
              </dd>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Monthly Earnings</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
                  />
                  <Bar dataKey="amount" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Transactions</h3>
            <div className="mt-6 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Source</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {earnings.map((earning) => (
                        <tr key={earning.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                            {new Date(earning.createdAt).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${earning.amount.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {earning.source}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              earning.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : earning.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {earning.status}
                            </span>
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
  )
} 