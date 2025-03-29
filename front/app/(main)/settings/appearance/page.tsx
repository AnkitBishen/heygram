"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export default function AppearancePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Appearance</h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Theme preference</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose how Heygram looks to you. Select a single theme, or sync with your system and automatically switch
            between day and night themes.
          </p>

          <RadioGroup value={theme} onValueChange={setTheme} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-3 cursor-pointer">
                <div className="bg-primary-foreground p-2 rounded-full">
                  <Sun className="h-5 w-5 text-primary" />
                </div>
                <span>Light</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-3 cursor-pointer">
                <div className="bg-primary-foreground p-2 rounded-full">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
                <span>Dark</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-3 cursor-pointer">
                <div className="bg-primary-foreground p-2 rounded-full">
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <span>System</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-4">
          <h2 className="text-lg font-medium mb-4">Preview</h2>
          <div className={`border rounded-lg p-4 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-10 w-10 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
              <div>
                <div className={`h-4 w-32 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
                <div className={`h-3 w-24 rounded mt-1 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
              </div>
            </div>
            <div className={`h-40 rounded ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}></div>
            <div className="flex gap-2 mt-4">
              <div className={`h-8 w-8 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
              <div className={`h-8 w-8 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
              <div className={`h-8 w-8 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

