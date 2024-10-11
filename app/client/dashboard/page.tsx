"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function ClientDashboard() {
  const { data: session } = useSession()
  const [order, setOrder] = useState('')
  const [amount, setAmount] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) * 100 }), // Convert to cents
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: {
              // In a real application, you'd collect card details securely
              // For this example, we're using a test card
              number: '4242424242424242',
              exp_month: 12,
              exp_year: 2024,
              cvc: '123',
            },
          },
        })

        if (result.error) {
          throw new Error(result.error.message)
        } else {
          toast({
            title: "Order Placed",
            description: `Your order for "${order}" has been placed and paid for.`,
          })
          setOrder('')
          setAmount('')
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      })
    }
  }

  if (!session) {
    return <div>Please sign in to access the client dashboard.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="order">What would you like to order?</Label>
          <Input
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Enter your order"
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <Button type="submit">Place Order and Pay</Button>
      </form>
    </div>
  )
}