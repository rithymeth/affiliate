import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    )

    const earnings = await prisma.affiliateEarning.findMany({
      where: { 
        affiliateId: payload.id as string 
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(earnings)
  } catch (error) {
    console.error('Earnings error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch earnings' },
      { status: 500 }
    )
  }
} 