import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    )

    const affiliateId = payload.id as string

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
          take: 5,
        }),
        prisma.affiliateClick.findMany({
          where: { affiliateId },
          orderBy: { timestamp: 'desc' },
          take: 5,
          include: { link: true },
        }),
      ])

      return NextResponse.json({
        links: links.map(link => ({
          id: link.id,
          name: link.name,
          url: link.targetUrl,
          trackingId: link.trackingId,
          createdAt: link.createdAt,
        })),
        earnings: earnings.map(earning => ({
          id: earning.id,
          amount: earning.amount,
          status: earning.status,
          source: earning.source,
          createdAt: earning.createdAt,
        })),
        clicks: clicks.map(click => ({
          id: click.id,
          linkName: click.link?.name || 'Unknown',
          timestamp: click.timestamp,
          ipAddress: click.ipAddress,
          converted: click.converted,
        })),
      })
    } catch (error) {
      console.error('Error fetching affiliate data:', error)
      return NextResponse.json(
        { message: 'Failed to fetch affiliate data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    )
  }
} 