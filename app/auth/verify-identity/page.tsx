"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function VerifyIdentity() {
  const [idFront, setIdFront] = useState<string | null>(null)
  const [idBack, setIdBack] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: string | null) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFile(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idFront || !idBack) {
      toast({
        title: "Error",
        description: "Please upload both front and back of your ID",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idFront: idFront.split(',')[1],
          idBack: idBack.split(',')[1],
        }),
      })

      if (response.ok) {
        toast({
          title: "Identity Verification Submitted",
          description: "Your identity documents have been submitted for verification.",
        })
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Identity verification failed')
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : 'An error occurred during identity verification',
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Verify Your Identity</h1>
        
        <div className="space-y-2">
          <Label htmlFor="idFront">Front of ID</Label>
          <Input id="idFront" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setIdFront)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idBack">Back of ID</Label>
          <Input id="idBack" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setIdBack)} />
        </div>

        <Button type="submit" className="w-full">Submit for Verification</Button>
      </form>
    </div>
  )
}