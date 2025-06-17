"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { postForgetResetPassword } from "@/lib/authApi"

function getSecondsLeft(expiryIso?: string) {
  if (!expiryIso) return null;
  const expiryTime = new Date(expiryIso).getTime();
  return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  const router = useRouter()
  const params = useSearchParams()
  const token = params.get("token")
  // expiry ISO8601 string, e.g. 2024-06-21T12:00:00.000Z
  const expiry = params.get("expiry")

  useEffect(() => {
    if (expiry) {
      setSecondsLeft(getSecondsLeft(expiry))
    }
  }, [expiry])

  useEffect(() => {
    if (secondsLeft === null) return
    if (secondsLeft === 0) return
    const timeout = setInterval(() => {
      setSecondsLeft((prev) => (prev! > 0 ? prev! - 1 : 0))
    }, 1000)
    return () => clearInterval(timeout)
  }, [secondsLeft])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("Invalid or missing reset token.")
      return
    }

    if (secondsLeft !== null && secondsLeft === 0) {
      setError("Reset link has expired.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    try {
      await postForgetResetPassword({
        actionFrom: 2,
        email: "", // usually backend gets email from token
        newPassword: password,
        oldPassword: "",
        token
      })
      setSuccess(true)
      setTimeout(() => {
        router.push("/login?reset=success")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Try again.")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {success
              ? "Your password has been reset!"
              : secondsLeft === 0
                ? "This reset link has expired. Try requesting a new one."
                : "Create a new password for your account"}
          </p>
          {expiry && !success && (
            <div className="text-sm mt-2 text-muted-foreground">
              {secondsLeft !== null && secondsLeft > 0 && (
                <>
                  Link expires in:{" "}
                  <span className="font-semibold">
                    {Math.floor(secondsLeft / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(secondsLeft % 60).toString().padStart(2, "0")}
                  </span>
                </>
              )}
              {secondsLeft === 0 && (
                <span className="text-red-500 font-medium">Link expired</span>
              )}
            </div>
          )}
        </div>

        {!success && (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                  value={password}
                  disabled={secondsLeft === 0}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  required
                  value={confirmPassword}
                  disabled={secondsLeft === 0}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button className="w-full rounded-xl py-6" disabled={isLoading || secondsLeft === 0}>
                {isLoading ? "Resetting password..." : "Reset Password"}
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
        )}
      </div>
    </div>
  )
}
