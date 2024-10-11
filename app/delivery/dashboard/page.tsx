"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function DeliveryDashboard() {
  const { data: session } = useSession()
  const [available, setAvailable] = useState(false)
  const [deliveries, setDeliveries] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    // Fetch current deliveries
    // This is a placeholder and should be replaced with actual API call
    setDeliveries([
      { id: 1, from: 'Restaurant A', to: 'Client X', status: 'Pending' },
      { id: 2, from: 'Store B', to: 'Client Y', status: 'In Progress' },
    ])
  }, [])

  const handleAvailabilityChange = async (checked: boolean) => {
    setAvailable(checked)
    // Here you would typically update the backend about the availability change
    toast({
      title: checked ? "You're Now Available" : "You're Now Unavailable",
      description: checked ? "You'll be notified of new delivery requests." : "You won't receive new delivery requests.",
    })
  }

  const handleDeliveryStatus = async (deliveryId: number, newStatus: string) => {
    // Update delivery status
    // This is a placeholder and should be replaced with actual API call
    setDeliveries(deliveries.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
    ))
    toast({
      title: "Delivery Updated",
      description: `Delivery #${deliveryId} status changed to ${newStatus}.`,
    })
  }

  if (!session) {
    return <div>Please sign in to access the delivery dashboard.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>
      <div className="flex items-center space-x-2 mb-8">
        <Switch
          id="availability"
          checked={available}
          onCheckedChange={handleAvailabilityChange}
        />
        <Label htmlFor="availability">Available for Deliveries</Label>
      </div>

      <h2 className="text-xl font-semibold mb-4">Current Deliveries</h2>
      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="p-4 border rounded">
            <p>From: {delivery.from}</p>
            <p>To: {delivery.to}</p>
            <p>Status: {delivery.status}</p>
            <div className="mt-2">
              <Button onClick={() => handleDeliveryStatus(delivery.id, 'Picked Up')} className="mr-2">
                Mark as Picked Up
              </Button>
              <Button onClick={() => handleDeliveryStatus(delivery.id, 'Delivered')} className="mr-2">
                Mark as Delivered
              </Button>
              <Button onClick={() => handleDeliveryStatus(delivery.id, 'Cancelled')} variant="destructive">
                Cancel Delivery
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}