import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const affiliates = await prisma.affiliate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(affiliates);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch affiliates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const affiliate = await prisma.affiliate.create({
      data: {
        name: data.name,
        email: data.email,
        website: data.website,
        commission: data.commission,
      },
    });
    return NextResponse.json(affiliate);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create affiliate' },
      { status: 500 }
    );
  }
} 