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

    const links = await prisma.link.findMany({
      where: { affiliateId: payload.id as string },
      include: {
        clicks: true,
        conversions: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedLinks = links.map(link => ({
      id: link.id,
      url: link.url,
      createdAt: link.createdAt,
      clicks: link.clicks.length,
      conversions: link.conversions.length,
    }))

    return NextResponse.json(formattedLinks)
  } catch (error) {
    console.error('Links error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch links' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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

    const { url } = await request.json()

    const link = await prisma.link.create({
      data: {
        url,
        affiliateId: payload.id as string,
      },
      include: {
        clicks: true,
        conversions: true,
      },
    })

    return NextResponse.json({
      id: link.id,
      url: link.url,
      createdAt: link.createdAt,
      clicks: 0,
      conversions: 0,
    })
  } catch (error) {
    console.error('Create link error:', error)
    return NextResponse.json(
      { message: 'Failed to create link' },
      { status: 500 }
    )
  }
} 