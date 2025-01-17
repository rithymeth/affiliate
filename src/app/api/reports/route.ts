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

    // Get date range from query params
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'
    const days = parseInt(range.replace('d', ''))
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all relevant data
    const [clicks, conversions, links] = await Promise.all([
      prisma.click.findMany({
        where: {
          affiliateId: payload.id as string,
          createdAt: { gte: startDate }
        },
        include: { link: true }
      }),
      prisma.conversion.findMany({
        where: {
          affiliateId: payload.id as string,
          createdAt: { gte: startDate }
        },
        include: { link: true }
      }),
      prisma.link.findMany({
        where: {
          affiliateId: payload.id as string,
        },
        include: {
          clicks: { where: { createdAt: { gte: startDate } } },
          conversions: { where: { createdAt: { gte: startDate } } }
        }
      })
    ])

    // Calculate daily clicks
    const dailyClicks = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayClicks = clicks.filter(click => {
        const clickDate = new Date(click.createdAt)
        clickDate.setHours(0, 0, 0, 0)
        return clickDate.getTime() === date.getTime()
      }).length

      return {
        date: date.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
        clicks: dayClicks
      }
    }).reverse()

    // Calculate conversions by source
    const sourceMap = conversions.reduce((acc, conv) => {
      const source = conv.link.url.includes('facebook') ? 'Facebook' :
                    conv.link.url.includes('instagram') ? 'Instagram' :
                    conv.link.url.includes('twitter') ? 'Twitter' : 'Other'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const conversionsBySource = Object.entries(sourceMap).map(([source, count]) => ({
      source,
      count
    }))

    // Calculate top performing links
    const topLinks = links
      .map(link => ({
        url: link.url,
        clicks: link.clicks.length,
        conversions: link.conversions.length,
        earnings: link.conversions.reduce((sum, conv) => sum + conv.amount, 0)
      }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5)

    // Calculate overall performance metrics
    const totalClicks = clicks.length
    const totalConversions = conversions.length
    const conversionRate = totalClicks ? (totalConversions / totalClicks) * 100 : 0
    const totalEarnings = conversions.reduce((sum, conv) => sum + conv.amount, 0)
    const averageOrderValue = totalConversions ? totalEarnings / totalConversions : 0

    return NextResponse.json({
      dailyClicks,
      conversionsBySource,
      topLinks,
      performance: {
        totalClicks,
        totalConversions,
        conversionRate,
        totalEarnings,
        averageOrderValue
      }
    })
  } catch (error) {
    console.error('Reports error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch report data' },
      { status: 500 }
    )
  }
} 