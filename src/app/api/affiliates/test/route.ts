import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    // First try to find the test affiliate
    let testAffiliate = await prisma.affiliate.findFirst({
      where: {
        email: 'test@example.com',
      },
      select: {
        id: true,
        name: true,
        email: true,
        website: true,
        commission: true,
        status: true,
      },
    });

    // If not found, create it
    if (!testAffiliate) {
      const hashedPassword = await hash('test123', 10);
      
      testAffiliate = await prisma.affiliate.create({
        data: {
          name: 'Test Affiliate',
          email: 'test@example.com',
          password: hashedPassword,
          website: 'https://example.com',
          commission: 10,
          status: 'active',
        },
        select: {
          id: true,
          name: true,
          email: true,
          website: true,
          commission: true,
          status: true,
        },
      });
    }

    return NextResponse.json(testAffiliate);
  } catch (error) {
    console.error('Failed to get/create test affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to get/create test affiliate' },
      { status: 500 }
    );
  }
} 