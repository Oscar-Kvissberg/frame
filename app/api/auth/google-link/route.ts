import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Du måste vara inloggad för att koppla ett Google-konto' },
        { status: 401 }
      )
    }

    const { googleEmail } = await req.json()

    if (!googleEmail) {
      return NextResponse.json(
        { message: 'Google e-postadress saknas' },
        { status: 400 }
      )
    }

    // Check if the Google email matches the logged-in user's email
    if (googleEmail !== session.user.email) {
      return NextResponse.json(
        { message: 'Google e-postadressen matchar inte din inloggade e-postadress' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Användare hittades inte' },
        { status: 404 }
      )
    }

    // Check if the user already has a Google account linked
    const existingGoogleAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: 'google',
      },
    })

    if (existingGoogleAccount) {
      return NextResponse.json(
        { message: 'Du har redan ett Google-konto kopplat till ditt konto' },
        { status: 400 }
      )
    }

    // For now, we'll just return success
    // In a real implementation, you would need to handle the OAuth flow here
    return NextResponse.json(
      { message: 'Google-konto kopplat' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Google link error:', error)
    return NextResponse.json(
      { message: 'Något gick fel vid koppling av Google-konto' },
      { status: 500 }
    )
  }
} 