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

    const notifications = await prisma.notification.findMany({
      where: { 
        affiliateId: payload.id as string,
        read: false
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// Mark notification as read
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

    const { notificationId } = await request.json()

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        affiliateId: payload.id as string
      },
      data: { read: true }
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json(
      { message: 'Failed to update notification' },
      { status: 500 }
    )
  }
} 