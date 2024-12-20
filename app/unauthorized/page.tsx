'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginWithAuthBlue } from 'ssoauthblue'

export default function UnauthorizedPage() {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')

  const handleLogin = async () => {
    try {
      await loginWithAuthBlue({
        returnUrl: returnUrl || '/',
      })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Access Required</CardTitle>
          <CardDescription>
            Please log in to access this application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">
              You need to be logged in with your SSO account to access this application. 
              Click the button below to log in.
            </p>
            <Button onClick={handleLogin} className="w-full">
              Log in with SSO
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
