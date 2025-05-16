"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call for password reset
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r">
            <Instagram className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isSubmitted
              ? "Check your email, or phone for a link to reset your password"
              : "Enter your email, phone, or username and we'll send you a link to reset your password"}
          </p>
        </div>

        {!isSubmitted ? (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                {/* <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label> */}
                <Input
                  id="email"
                  type="email"
                  placeholder="Email, Phone, or Username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <Button className="w-full rounded-xl py-6" disabled={isLoading}>
                {isLoading ? "Sending reset link..." : "Send Reset Link"}
              </Button>
            </form>
            <div className="text-center text-sm">
              <Link href="/login" className="text-primary font-medium hover:underline">
                Back to login
              </Link>
              <span className="mx-2 text-muted-foreground">•</span>
              <Link href="/register" className="text-primary font-medium hover:underline">
                Create new account
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span className="font-medium">Reset link sent!</span>
              </div>
              <p className="mt-2 text-sm">
                We've sent a password reset link to <span className="font-semibold">{email}</span>. Please check your
                email and follow the instructions to reset your password.
              </p>
            </div>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or request another link.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="rounded-xl" onClick={() => setIsSubmitted(false)}>
                  Try another email
                </Button>
                <Button className="rounded-xl" onClick={handleSubmit}>
                  Resend link
                </Button>
              </div>
            </div>
            <div className="text-center text-sm">
              <Link href="/login" className="text-primary font-medium hover:underline">
                Back to login
              </Link>
              <span className="mx-2 text-muted-foreground">•</span>
              <Link href="/register" className="text-primary font-medium hover:underline">
                Create new account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
