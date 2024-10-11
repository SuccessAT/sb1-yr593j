"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function DeliveryPage() {
  const [available, setAvailable] = useState(false)
  const { toast } = useToast()

  const handleAvailabilityChange = (checked: boolean) => {
    setAvailable(checked)
    // Here you would typically update the backend about the availability change
    toast({
      title: checked ? "You're Now Available" : "You're Now Unavailable",
      description: checked ? "You'll be notified of new delivery requests." : "You won't receive new delivery requests.",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>
      <div className="flex items-center space-x-2">
        <Switch
          id="availability"
          checked={available}
          onCheckedChange={handleAvailabilityChange}
        />
        <Label htmlFor="availability">Available for Deliveries</Label>
      </div>
      {available && (
        <div className="mt-4">
          <p>You're currently available for deliveries. New requests will appear here.</p>
        </div>
      )}
    </div>
  )
}