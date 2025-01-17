import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  try {
    const { affiliateId } = params;

    const links = await prisma.affiliateLink.findMany({
      where: {
        affiliateId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        targetUrl: true,
        uniqueCode: true,
        active: true,
        createdAt: true,
        _count: {
          select: {
            clicks: true,
          },
        },
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Failed to fetch affiliate links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affiliate links' },
      { status: 500 }
    );
  }
} 