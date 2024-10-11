import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Marketplace</h1>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/client">I'm a Client</Link>
        </Button>
        <Button asChild>
          <Link href="/vendor">I'm a Vendor</Link>
        </Button>
        <Button asChild>
          <Link href="/delivery">I'm a Delivery Person</Link>
        </Button>
      </div>
    </div>
  )
}