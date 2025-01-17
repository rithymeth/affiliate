import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { affiliateId } = await request.json();
    
    if (!affiliateId) {
      return NextResponse.json(
        { message: 'Affiliate ID is required' },
        { status: 400 }
      );
    }

    // Get request headers
    const ipAddress = request.headers.get('x-forwarded-for') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    // Create click record
    const click = await prisma.affiliateClick.create({
      data: {
        affiliateId,
        timestamp: new Date(),
        ipAddress,
        userAgent,
        referrer,
        converted: false
      }
    });

    return NextResponse.json({
      success: true,
      clickId: click.id
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { message: 'Failed to track visit' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { clickId, duration, pageViews } = await request.json();

    if (!clickId) {
      return NextResponse.json(
        { message: 'Click ID is required' },
        { status: 400 }
      );
    }

    // Update click with additional data
    await prisma.affiliateClick.update({
      where: { id: clickId },
      data: {
        converted: pageViews > 2 // Example conversion logic
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating visit:', error);
    return NextResponse.json(
      { message: 'Failed to update visit' },
      { status: 500 }
    );
  }
} 