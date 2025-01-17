import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface MonthlyStats {
  month: string;
  earnings: number;
  clicks: number;
  conversions: number;
}

export async function GET(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  try {
    const affiliateId = params.affiliateId;

    // Get total earnings
    const totalEarnings = await prisma.affiliateEarning.aggregate({
      where: { affiliateId },
      _sum: { amount: true }
    });

    // Get pending earnings
    const pendingEarnings = await prisma.affiliateEarning.aggregate({
      where: { 
        affiliateId,
        status: 'pending'
      },
      _sum: { amount: true }
    });

    // Get last payout
    const lastPayout = await prisma.affiliatePayout.findFirst({
      where: { affiliateId },
      orderBy: { createdAt: 'desc' }
    });

    // Get monthly stats
    const monthlyStats = await prisma.$queryRaw<MonthlyStats[]>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
        SUM(amount) as earnings,
        COUNT(DISTINCT "affiliateId") as clicks,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as conversions
      FROM "AffiliateEarning"
      WHERE "affiliateId" = ${affiliateId}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 12
    `;

    return NextResponse.json({
      totalEarnings: Number(totalEarnings._sum.amount || 0),
      pendingEarnings: Number(pendingEarnings._sum.amount || 0),
      lastPayout: Number(lastPayout?.amount || 0),
      monthlyEarnings: monthlyStats.map((stat) => ({
        month: stat.month,
        earnings: Number(stat.earnings),
        clicks: Number(stat.clicks),
        conversions: Number(stat.conversions)
      }))
    });
  } catch (error) {
    console.error('Earnings error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
} 