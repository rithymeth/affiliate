import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = headers()
  const affiliateId = headersList.get('x-affiliate-id')

  if (!affiliateId) {
    return NextResponse.json({ error: 'Affiliate ID required' }, { status: 400 })
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Initial connection message
      sendEvent({ type: 'connected' })

      // Set up interval to send updates
      const interval = setInterval(async () => {
        try {
          // Fetch latest data
          const [links, earnings, clicks] = await Promise.all([
            prisma.affiliateLink.findMany({
              where: { affiliateId, active: true },
              orderBy: { createdAt: 'desc' },
            }),
            prisma.affiliateEarning.findMany({
              where: { affiliateId },
              orderBy: { createdAt: 'desc' },
              take: 10,
            }),
            prisma.affiliateClick.count({
              where: { 
                affiliateId,
                timestamp: { 
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
                }
              },
            }),
          ])

          sendEvent({ 
            type: 'update',
            data: { links, earnings, clicks }
          })
        } catch (error) {
          console.error('Error fetching real-time data:', error)
        }
      }, 5000) // Update every 5 seconds

      // Cleanup on close
      return () => {
        clearInterval(interval)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 