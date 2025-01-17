import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  try {
    const { affiliateId } = params;

    // Get total earnings
    const totalEarnings = await prisma.affiliateEarning.aggregate({
      where: { affiliateId },
      _sum: { amount: true },
    });

    // Get pending earnings
    const pendingEarnings = await prisma.affiliateEarning.aggregate({
      where: { 
        affiliateId,
        status: 'pending'
      },
      _sum: { amount: true },
    });

    // Get last payout
    const lastPayout = await prisma.affiliatePayout.findFirst({
      where: { 
        affiliateId,
        status: 'completed'
      },
      orderBy: { createdAt: 'desc' },
      select: { amount: true },
    });

    // Get monthly earnings and clicks
    const monthlyStats = await prisma.$queryRaw`
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', current_date - interval '11 months'),
          date_trunc('month', current_date),
          interval '1 month'
        ) as month
      )
      SELECT 
        to_char(months.month, 'Mon YYYY') as month,
        COALESCE(SUM(e.amount)::float, 0) as earnings,
        COALESCE(COUNT(DISTINCT c.id)::integer, 0) as clicks
      FROM months
      LEFT JOIN "AffiliateEarning" e ON 
        date_trunc('month', e."createdAt") = months.month
        AND e."affiliateId" = ${affiliateId}
      LEFT JOIN "AffiliateClick" c ON 
        date_trunc('month', c."createdAt") = months.month
        AND c."affiliateId" = ${affiliateId}
      GROUP BY months.month
      ORDER BY months.month ASC
    `;

    // Convert BigInt to Number in the response
    const response = {
      totalEarnings: Number(totalEarnings._sum.amount || 0),
      pendingEarnings: Number(pendingEarnings._sum.amount || 0),
      lastPayout: Number(lastPayout?.amount || 0),
      monthlyEarnings: monthlyStats.map((stat: any) => ({
        month: stat.month,
        earnings: Number(stat.earnings),
        clicks: Number(stat.clicks),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
} 