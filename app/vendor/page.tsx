"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'

export default function VendorPage() {
  const [service, setService] = useState('')
  const [price, setPrice] = useState('')
  const [homeService, setHomeService] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the service details to your backend
    toast({
      title: "Service Added",
      description: `Your service "${service}" has been added at $${price}.`,
    })
    setService('')
    setPrice('')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
    </div>
  )
}