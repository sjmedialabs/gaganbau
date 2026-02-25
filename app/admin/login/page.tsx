"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useSimpleAuth } from "@/lib/simple-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useSimpleAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await signIn(email, password)
    if (success) {
      toast.success("Login successful!")
      router.push("/admin")
    } else {
      toast.error("Invalid email or password")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/logo.png" 
              alt="Gagan Bau GmbH" 
              width={100} 
              height={60}
              className="mx-auto"
            />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the CMS dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold-dark text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p className="text-muted-foreground">Email: admin@gaganbau.de</p>
            <p className="text-muted-foreground">Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
