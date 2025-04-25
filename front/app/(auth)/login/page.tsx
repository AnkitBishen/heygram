"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Instagram } from "lucide-react"
import {UAParser} from 'ua-parser-js';

/**
 * Utility to detect simple browser name & device
 */
function getBrowserAndDevice() {
  const ua = typeof window !== "undefined" ? window.navigator.userAgent : ""
  let browser = "Unknown Browser"
  let device = "Unknown Device"
  let deviceName = "Unknown Device Name"

  // const parser = new UAParser();
  // const result = parser.getResult();
  // console.log(result.browser.name); // Chrome, Firefox, etc.
  // console.log(result.device.type);  // mobile, tablet, etc.
  // console.log(result.os.name);      // Windows, Android, iOS, etc.


  // browser = result.browser.name ? result.browser.name : browser;
  // if(result.os.name == 'Windows'){
  //   device = "Desktop";
  // }else{
  //   device = result.os.name ? result.os.name : device;
  // }

  // deviceName = result.device.model ? result.device.model : deviceName;



  // Simple browser detection (not exhaustive)
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome"
  else if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Edg")) browser = "Edge"
  else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera"

  // Device detection 
  if (
    /Mobi|Android|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  ) {
    device = "Mobile"
  } else if (
    /Tablet|iPad|Nexus 7|Nexus 10|KFAPWI/i.test(ua)
  ) {
    device = "Tablet"
  } else {
    device = "Desktop"
  }

  // Device name detection 
  if (/iPhone/.test(ua)) {
    deviceName = 'iPhone'
  } else if (/iPad/.test(ua)) {
    deviceName = 'iPad'
  } else if (/Android/.test(ua)) {
    if (/Mobile/.test(ua)) {
      deviceName = 'Android Phone'
    } else {
      deviceName = 'Android Tablet'
    }
  } else if (/Windows/.test(ua)) {
    deviceName = 'Windows PC'
  } else if (/Macintosh/.test(ua)) {
    deviceName = 'Mac'
  }
  return { browser, device, deviceName }
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    const { browser, device, deviceName } = getBrowserAndDevice()
    try {
      const res = await fetch("http://192.168.176.217:8000/auth/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          browser: browser,
          device: device,
          deviceName: deviceName,
        }),
      })
      // console.log(res)
      if (!res.ok) {
        // Handle errors based on API response
        const errMsg = (await res.json())?.message ?? "Login failed"
        throw new Error(errMsg)
      }
      const data = await res.json()
      // Handle login success (e.g., saving token, redirect)
      // For demonstration: redirect to home
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to login.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <Instagram className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold">Heygram</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
        </div>
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                placeholder="Enter your email or username"
                required
                type="text"
                className="rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                placeholder="Enter your password"
                required
                type="password"
                className="rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full">
              Continue with Facebook
            </Button>
          </div>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}