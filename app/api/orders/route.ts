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

    const { service, vendorId, amount } = await req.json()

    const order = await prisma.order.create({
      data: {
        service,
        amount,
        status: 'PENDING',
        client: { connect: { email: session.user.email! } },
        vendor: { connect: { id: vendorId } },
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'An error occurred while creating the order' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let orders
    if (user.role === 'CLIENT') {
      orders = await prisma.order.findMany({
        where: { clientId: user.id },
        include: { vendor: true },
      })
    } else if (user.role === 'VENDOR') {
      orders = await prisma.order.findMany({
        where: { vendorId: user.id },
        include: { client: true },
      })
    } else {
      orders = await prisma.order.findMany({
        where: { deliveryPersonId: user.id },
        include: { client: true, vendor: true },
      })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'An error occurred while fetching orders' }, { status: 500 })
  }
}