import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET() {
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

    // Get overall stats
    const [totalAffiliates, totalEarnings, totalClicks] = await Promise.all([
      prisma.affiliate.count(),
      prisma.affiliateEarning.aggregate({
        where: { status: 'approved' },
        _sum: { amount: true }
      }),
      prisma.affiliateClick.count()
    ])

    // Get recent activity
    const recentActivity = await prisma.affiliate.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        clicks: {
          take: 5,
          orderBy: { timestamp: 'desc' },
          select: {
            timestamp: true,
            ipAddress: true,
            converted: true
          }
        },
        earnings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            amount: true,
            status: true,
            createdAt: true
          }
        },
        trackingConversions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            amount: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      overview: {
        totalAffiliates,
        totalEarnings: Number(totalEarnings._sum.amount || 0),
        totalClicks,
        conversionRate: totalClicks > 0 
          ? Number(((totalEarnings._sum.amount || 0) / totalClicks).toFixed(2))
          : 0
      },
      recentActivity: recentActivity.map(affiliate => ({
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        createdAt: affiliate.createdAt,
        recentClicks: affiliate.clicks,
        recentEarnings: affiliate.earnings,
        recentConversions: affiliate.trackingConversions
      }))
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 