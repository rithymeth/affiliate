import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { SignJWT } from 'jose'

export async function POST(request: Request) {
  try {
    const { name, email, password, website } = await request.json()

    // Check if email already exists
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { email },
    })

    if (existingAffiliate) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create affiliate
    const affiliate = await prisma.affiliate.create({
      data: {
        name,
        email,
        password: hashedPassword,
        website,
        status: 'pending',
      },
    })

    // Create JWT token using jose
    const token = await new SignJWT({ id: affiliate.id, email: affiliate.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key'))

    // Set cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 