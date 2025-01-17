import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { affiliateId, referrer, duration, pageViews } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || '';

    const visit = await prisma.affiliateVisit.create({
      data: {
        affiliateId,
        timestamp: new Date(),
        ipAddress,
        userAgent,
        referrer,
        duration,
        pageViews,
      },
    });

    return NextResponse.json({ success: true, visit });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to track visit' },
      { status: 500 }
    );
  }
} 