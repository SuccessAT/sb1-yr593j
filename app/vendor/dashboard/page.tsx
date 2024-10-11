"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'

export default function VendorDashboard() {
  const { data: session } = useSession()
  const [service, setService] = useState('')
  const [price, setPrice] = useState('')
  const [homeService, setHomeService] = useState(false)
  const [orders, setOrders] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    // Fetch orders for this vendor
    // This is a placeholder and should be replaced with actual API call
    setOrders([
      { id: 1, service: 'Cleaning', price: 50, status: 'Pending' },
      { id: 2, service: 'Gardening', price: 75, status: 'Completed' },
    ])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the service details to your backend
    toast({
      title: "Service Added",
      description: `Your service "${service}" has been added at $${price}.`,
    })
    setService('')
    setPrice('')
  }

  const handleOrderStatus = async (orderId: number, newStatus: string) => {
    // Update order status
    // This is a placeholder and should be replaced with actual API call
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    toast({
      title: "Order Updated",
      description: `Order #${orderId} status changed to ${newStatus}.`,
    })
  }

  if (!session) {
    return <div>Please sign in to access the vendor dashboard.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="service">Service Name</Label>
          <Input
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Enter your service"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="home-service"
            checked={homeService}
            onCheckedChange={setHomeService}
          />
          <Label htmlFor="home-service">Offer Home Service</Label>
        </div>
        <Button type="submit">Add Service</Button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Current Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 border rounded">
            <p>Service: {order.service}</p>
            <p>Price: ${order.price}</p>
            <p>Status: {order.status}</p>
            <div className="mt-2">
              <Button onClick={() => handleOrderStatus(order.id, 'Completed')} className="mr-2">
                Mark as Completed
              </Button>
              <Button onClick={() => handleOrderStatus(order.id, 'Cancelled')} variant="destructive">
                Cancel Order
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}