'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { AffiliateLink } from '@/types/affiliate'

interface AffiliateLinkManagerProps {
  className?: string
}

export default function AffiliateLinkManager({ className = '' }: AffiliateLinkManagerProps) {
  const { user } = useAuth()
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (user) {
      fetchLinks()
    }
  }, [user])

  const fetchLinks = async () => {
    try {
      const response = await fetch(`/api/affiliate/links/${user?.id}`)
      if (!response.ok) throw new Error('Failed to fetch links')
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      setError('Failed to load affiliate links')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/affiliate/links/${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url })
      })

      if (!response.ok) throw new Error('Failed to create link')
      
      const newLink = await response.json()
      setLinks([newLink, ...links])
      setName('')
      setUrl('')
      setShowForm(false)
    } catch (error) {
      setError('Failed to create affiliate link')
      console.error('Error:', error)
    }
  }

  const deleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/affiliate/links?id=${linkId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete link')
      setLinks(links.filter(link => link.id !== linkId))
    } catch (error) {
      setError('Failed to delete affiliate link')
      console.error('Error:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Affiliate Links</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : 'Create New Link'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createLink} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Link Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              Target URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Create Link
          </button>
        </form>
      )}

      <div className="bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((link) => (
              <tr key={link.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{link.name}</div>
                  <div className="text-sm text-gray-500">{link.url}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm text-gray-600">{link.trackingId}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {link.clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(link.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}