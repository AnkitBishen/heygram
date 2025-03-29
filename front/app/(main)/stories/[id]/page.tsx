"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { X, Heart, Send, MoreHorizontal } from "lucide-react"

export default function StoryViewPage({ params }: { params: { id: string } }) {
  const storyId = params.id
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)

  // Simulate story progress
  useEffect(() => {
    if (paused) return

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          // Navigate to next story or close
          setTimeout(() => router.push("/"), 500)
          return 100
        }
        return prev + 0.5
      })
    }, 50)

    return () => clearInterval(timer)
  }, [paused, router])

  // Pause on hold
  const handleMouseDown = () => setPaused(true)
  const handleMouseUp = () => setPaused(false)
  const handleTouchStart = () => setPaused(true)
  const handleTouchEnd = () => setPaused(false)

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2">
        <Progress value={progress} className="h-1" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-primary">
              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={`User ${storyId}`} />
              <AvatarFallback>U{storyId}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">user{storyId}</p>
              <p className="text-xs text-gray-400">3h ago</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setPaused(!paused)}>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={() => router.push("/")}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="flex-1 flex items-center justify-center">
        <Image
          src={`/placeholder.svg?height=800&width=450`}
          alt={`Story ${storyId}`}
          width={450}
          height={800}
          className="max-h-full object-contain"
          priority
        />
      </div>

      {/* Footer / Reply */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center gap-2 bg-transparent backdrop-blur-sm rounded-full border border-gray-700 p-1 pl-4">
          <Input
            placeholder={`Reply to user${storyId}...`}
            className="border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

