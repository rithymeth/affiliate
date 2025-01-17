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

    const affiliate = await prisma.affiliate.findUnique({
      where: { id: payload.id as string },
      select: {
        website: true,
        paymentMethod: true,
        emailNotifications: true
      }
    })

    if (!affiliate) {
      return NextResponse.json(
        { message: 'Affiliate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      website: affiliate.website,
      paymentMethod: affiliate.paymentMethod || 'paypal',
      emailNotifications: affiliate.emailNotifications || true
    })
  } catch (error) {
    console.error('Settings error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
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

    const { website, paymentMethod, emailNotifications } = await request.json()

    const updatedAffiliate = await prisma.affiliate.update({
      where: { id: payload.id as string },
      data: {
        website,
        paymentMethod,
        emailNotifications
      },
      select: {
        website: true,
        paymentMethod: true,
        emailNotifications: true
      }
    })

    return NextResponse.json(updatedAffiliate)
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { message: 'Failed to update settings' },
      { status: 500 }
    )
  }
} 