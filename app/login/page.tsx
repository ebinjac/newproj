'use client'

import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/settings/team1')
    }
  }, [user, router])

  const handleLogin = (email: string) => {
    setIsLoading(true)
    try {
      login(email)
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${email}!`,
      })
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Error logging in",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-500">Choose a test user to login as</p>
        </div>
        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={() => handleLogin('user1@example.com')}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login as User 1 (2 teams)"}
          </Button>
          <Button
            className="w-full"
            onClick={() => handleLogin('user2@example.com')}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login as User 2 (1 team)"}
          </Button>
        </div>
      </div>
    </div>
  )
}
