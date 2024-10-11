import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { idFront, idBack } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user || !user.stripeAccountId) {
      return NextResponse.json({ error: 'User not found or not a vendor/delivery person' }, { status: 400 })
    }

    // Upload identity documents to Stripe
    const frontDocument = await stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: Buffer.from(idFront, 'base64'),
        name: 'id_front.jpg',
        type: 'application/octet-stream',
      },
    })

    const backDocument = await stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: Buffer.from(idBack, 'base64'),
        name: 'id_back.jpg',
        type: 'application/octet-stream',
      },
    })

    // Update Stripe account with identity verification
    await stripe.accounts.update(user.stripeAccountId, {
      individual: {
        verification: {
          document: {
            front: frontDocument.id,
            back: backDocument.id,
          },
        },
      },
    })

    // Update user status in database
    await prisma.user.update({
      where: { id: user.id },
      data: { identityVerified: true },
    })

    return NextResponse.json({ message: 'Identity verification submitted successfully' })
  } catch (error) {
    console.error('Identity verification error:', error)
    return NextResponse.json({ error: 'An error occurred during identity verification' }, { status: 500 })
  }
}