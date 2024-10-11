"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['CLIENT', 'VENDOR', 'DELIVERY']),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const router = useRouter()
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created.",
        })
        router.push('/auth/signin')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <RadioGroup defaultValue="CLIENT">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CLIENT" id="client" {...register('role')} />
              <Label htmlFor="client">Client</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="VENDOR" id="vendor" {...register('role')} />
              <Label htmlFor="vendor">Vendor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DELIVERY" id="delivery" {...register('role')} />
              <Label htmlFor="delivery">Delivery Person</Label>
            </div>
          </RadioGroup>
          {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
        </div>

        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  )
}