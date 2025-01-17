import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface DailyStats {
  date: Date;
  clicks: number;
  earnings: number;
  conversions: number;
}

export async function GET(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  try {
    const affiliateId = params.affiliateId;

    // Get total clicks
    const totalClicks = await prisma.affiliateClick.count({
      where: { affiliateId }
    });

    // Get total earnings
    const earnings = await prisma.affiliateEarning.aggregate({
      where: { affiliateId },
      _sum: { amount: true }
    });

    // Get total conversions
    const conversions = await prisma.affiliateClick.count({
      where: {
        affiliateId,
        converted: true
      }
    });

    // Get active links count
    const activeLinks = await prisma.affiliateLink.count({
      where: {
        affiliateId,
        active: true
      }
    });

    // Get daily stats for the last 30 days
    const dailyStats = await prisma.$queryRaw<DailyStats[]>`
      WITH days AS (
        SELECT generate_series(
          date_trunc('day', current_date - interval '29 days'),
          date_trunc('day', current_date),
          interval '1 day'
        )::date as date
      )
      SELECT 
        days.date,
        COUNT(DISTINCT c.id) as clicks,
        COALESCE(SUM(e.amount), 0) as earnings,
        COUNT(DISTINCT CASE WHEN c.converted THEN c.id END) as conversions
      FROM days
      LEFT JOIN "AffiliateClick" c ON 
        date_trunc('day', c."timestamp") = days.date
        AND c."affiliateId" = ${affiliateId}
      LEFT JOIN "AffiliateEarning" e ON 
        date_trunc('day', e."createdAt") = days.date
        AND e."affiliateId" = ${affiliateId}
      GROUP BY days.date
      ORDER BY days.date ASC
    `;

    return NextResponse.json({
      totalClicks,
      totalEarnings: Number(earnings._sum.amount || 0),
      conversions,
      activeLinks,
      dailyStats: dailyStats.map((stat) => ({
        date: stat.date.toISOString(),
        clicks: Number(stat.clicks),
        earnings: Number(stat.earnings),
        conversions: Number(stat.conversions)
      }))
    });
  } catch (error) {
    console.error('Error fetching affiliate stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch affiliate stats' },
      { status: 500 }
    );
  }
} 