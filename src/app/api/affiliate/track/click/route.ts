import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { affiliateId, referrer } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || '';

    const click = await prisma.affiliateClick.create({
      data: {
        affiliateId,
        timestamp: new Date(),
        ipAddress,
        userAgent,
        referrer,
        converted: false,
      },
    });

    return NextResponse.json({ success: true, click });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to track click' },
      { status: 500 }
    );
  }
} 