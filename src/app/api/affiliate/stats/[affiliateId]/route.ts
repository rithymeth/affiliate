import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  try {
    const { affiliateId } = params;

    // Get basic stats
    const totalClicks = await prisma.affiliateClick.count({
      where: { affiliateId },
    }) || 0;

    const earnings = await prisma.affiliateEarning.aggregate({
      where: { affiliateId },
      _sum: { amount: true },
    });

    const conversions = await prisma.affiliateClick.count({
      where: { 
        affiliateId,
        converted: true,
      },
    }) || 0;

    const activeLinks = await prisma.affiliateLink.count({
      where: {
        affiliateId,
        active: true,
      },
    }) || 0;

    // Get daily stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await prisma.$queryRaw`
      WITH dates AS (
        SELECT generate_series(
          date_trunc('day', now() - interval '30 days'),
          date_trunc('day', now()),
          '1 day'::interval
        )::date as date
      ),
      daily_clicks AS (
        SELECT 
          date_trunc('day', timestamp)::date as date,
          COUNT(*) as clicks
        FROM "AffiliateClick"
        WHERE "affiliateId" = ${affiliateId}
          AND timestamp >= ${thirtyDaysAgo}
        GROUP BY 1
      ),
      daily_earnings AS (
        SELECT 
          date_trunc('day', "createdAt")::date as date,
          SUM(amount) as earnings
        FROM "AffiliateEarning"
        WHERE "affiliateId" = ${affiliateId}
          AND "createdAt" >= ${thirtyDaysAgo}
        GROUP BY 1
      )
      SELECT 
        dates.date,
        COALESCE(daily_clicks.clicks, 0) as clicks,
        COALESCE(daily_earnings.earnings, 0) as earnings
      FROM dates
      LEFT JOIN daily_clicks ON dates.date = daily_clicks.date
      LEFT JOIN daily_earnings ON dates.date = daily_earnings.date
      ORDER BY dates.date ASC
    `;

    return NextResponse.json({
      totalClicks,
      totalEarnings: Number(earnings._sum?.amount || 0),
      conversions,
      activeLinks,
      dailyStats: dailyStats.map((stat: any) => ({
        date: stat.date.toISOString(),
        clicks: Number(stat.clicks),
        earnings: Number(stat.earnings),
      })),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affiliate stats' },
      { status: 500 }
    );
  }
} 