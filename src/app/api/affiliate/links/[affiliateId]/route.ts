import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  try {
    const affiliateId = params.affiliateId;

    const links = await prisma.affiliateLink.findMany({
      where: { affiliateId },
      select: {
        id: true,
        name: true,
        targetUrl: true,
        trackingId: true,
        active: true,
        createdAt: true,
        _count: {
          select: {
            clicks: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedLinks = links.map(link => ({
      id: link.id,
      name: link.name,
      url: link.targetUrl,
      trackingId: link.trackingId,
      active: link.active,
      clicks: link._count.clicks,
      createdAt: link.createdAt
    }));

    return NextResponse.json(formattedLinks);
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    return NextResponse.json(
      { message: 'Failed to fetch affiliate links' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  try {
    const affiliateId = params.affiliateId;
    const { name, targetUrl } = await request.json();

    const link = await prisma.affiliateLink.create({
      data: {
        name,
        targetUrl,
        trackingId: generateTrackingId(),
        affiliateId
      }
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error creating affiliate link:', error);
    return NextResponse.json(
      { message: 'Failed to create affiliate link' },
      { status: 500 }
    );
  }
}

function generateTrackingId(): string {
  // Generate a random string of 8 characters
  return Math.random().toString(36).substring(2, 10);
} 