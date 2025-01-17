import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface CreateLinkRequest {
  name: string;
  url: string;
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    );

    const { name, url } = await request.json() as CreateLinkRequest;
    const affiliateId = payload.id as string;

    const trackingId = generateTrackingId();
    const uniqueCode = generateUniqueCode();

    // Create affiliate link
    const link = await prisma.affiliateLink.create({
      data: {
        name,
        targetUrl: url,
        trackingId,
        uniqueCode,
        active: true,
        affiliate: {
          connect: { id: affiliateId }
        }
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
  return nanoid(8);
}

function generateUniqueCode(): string {
  return nanoid(6).toLowerCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliateId = searchParams.get('affiliateId');

    if (!affiliateId) {
      return NextResponse.json(
        { error: 'Affiliate ID is required' },
        { status: 400 }
      );
    }

    const links = await prisma.affiliateLink.findMany({
      where: {
        affiliateId,
        active: true,
      },
      orderBy: {
        createdAt: 'desc',
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    await prisma.affiliateLink.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete affiliate link:', error);
    return NextResponse.json(
      { error: 'Failed to delete affiliate link' },
      { status: 500 }
    );
  }
} 