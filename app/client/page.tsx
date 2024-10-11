"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function ClientPage() {
  const [order, setOrder] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the order to your backend
    toast({
      title: "Order Placed",
      description: `Your order for "${order}" has been placed.`,
    })
    setOrder('')
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
        <Button type="submit">Place Order</Button>
      </form>
    </div>
  )
}