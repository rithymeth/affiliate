import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface CreateAffiliateRequest {
  name: string;
  email: string;
  password: string;
  website?: string;
  commission?: number;
}

export async function GET() {
  try {
    const affiliates = await prisma.affiliate.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        website: true,
        commission: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            links: true,
            clicks: true,
            earnings: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(affiliates);
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    return NextResponse.json(
      { message: 'Failed to fetch affiliates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as CreateAffiliateRequest;

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const affiliate = await prisma.affiliate.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        website: data.website,
        commission: data.commission || 10,
        status: 'pending',
        paymentMethod: 'paypal',
        emailNotifications: true
      }
    });

    // Remove password from response
    const { password, ...affiliateWithoutPassword } = affiliate;

    return NextResponse.json(affiliateWithoutPassword);
  } catch (error) {
    console.error('Error creating affiliate:', error);
    return NextResponse.json(
      { message: 'Failed to create affiliate' },
      { status: 500 }
    );
  }
} 