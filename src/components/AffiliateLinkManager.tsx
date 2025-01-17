'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LinkIcon, PlusIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from './LoadingSpinner'

interface Link {
  id: string
  url: string
  createdAt: string
  clicks: number
  conversions: number
}

export default function AffiliateLinkManager() {
  const { user } = useAuth()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLinks()
  }, [user])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links')
      if (!response.ok) throw new Error('Failed to fetch links')
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching links:', error)
      setError('Failed to load links')
    } finally {
      setLoading(false)
    }
  }

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newLinkUrl }),
      })

      if (!response.ok) throw new Error('Failed to create link')
      
      const newLink = await response.json()
      setLinks([newLink, ...links])
      setNewLinkUrl('')
    } catch (error) {
      console.error('Error creating link:', error)
      setError('Failed to create link')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <form onSubmit={createLink} className="space-y-4">
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="flex gap-4">
          <input
            type="url"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder="Enter URL to create tracking link"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Link
          </button>
        </div>
      </form>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Your Tracking Links</h3>
          <div className="mt-6 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">URL</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Clicks</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Conversions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {links.map((link) => (
                      <tr key={link.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                          <div className="flex items-center">
                            <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900">
                              {link.url}
                            </a>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {link.clicks}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {link.conversions}
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
  )
}