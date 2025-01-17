import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET() {
  try {
    // Get user from token
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

    // Get affiliate stats
    const stats = await prisma.affiliate.findUnique({
      where: { id: payload.id as string },
      select: {
        _count: {
          select: {
            links: true,
          },
        },
        clicks: {
          select: {
            createdAt: true,
          },
        },
        conversions: {
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
    })

    if (!stats) {
      return NextResponse.json(
        { message: 'Stats not found' },
        { status: 404 }
      )
    }

    // Calculate total earnings
    const totalEarnings = stats.conversions.reduce((sum, conv) => sum + conv.amount, 0)
    
    // Calculate conversion rate
    const conversionRate = stats.clicks.length > 0 
      ? (stats.conversions.length / stats.clicks.length) * 100 
      : 0

    // Generate monthly data for chart
    const monthlyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('default', { month: 'short' })
      
      const monthClicks = stats.clicks.filter(click => {
        const clickDate = new Date(click.createdAt)
        return clickDate.getMonth() === date.getMonth() &&
               clickDate.getFullYear() === date.getFullYear()
      }).length

      const monthEarnings = stats.conversions
        .filter(conv => {
          const convDate = new Date(conv.createdAt)
          return convDate.getMonth() === date.getMonth() &&
                 convDate.getFullYear() === date.getFullYear()
        })
        .reduce((sum, conv) => sum + conv.amount, 0)

      return {
        name: month,
        clicks: monthClicks,
        earnings: monthEarnings
      }
    }).reverse()

    return NextResponse.json({
      stats: {
        totalClicks: stats.clicks.length,
        totalEarnings,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        activeLinks: stats._count.links
      },
      chartData: monthlyData
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 