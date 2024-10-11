import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, rating, review } = await req.json()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { client: true, vendor: true, deliveryPerson: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Determine who is being rated based on the user's role
    let ratedUserId
    if (session.user.email === order.client.email) {
      ratedUserId = order.deliveryPersonId || order.vendorId
    } else if (session.user.email === order.vendor.email) {
      ratedUserId = order.clientId
    } else if (order.deliveryPerson && session.user.email === order.deliveryPerson.email) {
      ratedUserId = order.clientId
    } else {
      return NextResponse.json({ error: 'You are not authorized to rate this order' }, { status: 403 })
    }

    const newRating = await prisma.rating.create({
      data: {
        rating,
        review,
        order: { connect: { id: orderId } },
        ratedBy: { connect: { email: session.user.email! } },
        ratedUser: { connect: { id: ratedUserId } },
      },
    })

    return NextResponse.json({ rating: newRating })
  } catch (error) {
    console.error('Rating creation error:', error)
    return NextResponse.json({ error: 'An error occurred while creating the rating' }, { status: 500 })
  }
}