'use client'

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon, UsersIcon } from '@heroicons/react/24/outline';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Stats {
  totalClicks: number;
  totalEarnings: number;
  conversions: number;
  activeLinks: number;
  dailyStats: {
    date: string;
    clicks: number;
    earnings: number;
  }[];
}

export default function AffiliateStats({ affiliateId }: { affiliateId: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/affiliate/stats/${affiliateId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Stats error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    if (affiliateId) {
      fetchStats();
    }
  }, [affiliateId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: UsersIcon,
      change: '+4.75%',
      positive: true,
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      change: '+54.02%',
      positive: true,
    },
    {
      title: 'Conversions',
      value: stats.conversions.toLocaleString(),
      icon: ArrowUpIcon,
      change: '-1.39%',
      positive: false,
    },
    {
      title: 'Active Links',
      value: stats.activeLinks.toLocaleString(),
      icon: ArrowUpIcon,
      change: '+10.18%',
      positive: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.positive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.positive ? (
                          <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                        ) : (
                          <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                        )}
                        <span className="ml-1">{stat.change}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Overview</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats.dailyStats}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number, name: string) => [
                  name === 'earnings' ? `$${value.toFixed(2)}` : value.toLocaleString(),
                  name === 'earnings' ? 'Earnings' : 'Clicks'
                ]}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="#6366F1"
                fill="url(#colorClicks)"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="earnings"
                name="Earnings"
                stroke="#10B981"
                fill="url(#colorEarnings)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 