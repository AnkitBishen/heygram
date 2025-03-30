"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface ProfileHoverCardProps {
  username?: string
  children: ReactNode
  position?: "top" | "bottom" | "left" | "right"
}

export function ProfileHoverCard({ username, children, position = "bottom" }: ProfileHoverCardProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>(null)
  const { getUserByUsername, followUser, unfollowUser, isFollowing } = useAuth()
  const triggerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Get user data when username changes
    if (username) {
      const user = getUserByUsername(username)
      setUserData(user)
    }
  }, [username, getUserByUsername])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, 500) // Delay to prevent flickering
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }

  // Handle clicks outside the card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleFollowToggle = () => {
    if (!userData) return

    if (isFollowing(userData.id)) {
      unfollowUser(userData.id)
    } else {
      followUser(userData.id)
    }
  }

  // Position classes
  const positionClasses: Record<string, string> = {
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div ref={triggerRef}>{children}</div>

      {isVisible && userData && (
        <div
          ref={cardRef}
          className={`absolute z-50 w-72 bg-card rounded-xl shadow-lg border animate-fade-in ${positionClasses[position]}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.username}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-1">
                  <Link href={`/profile/${userData.username}`} className="font-semibold hover:underline">
                    {userData.username}
                  </Link>
                  {userData.isVerified && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{userData.name}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm mb-3">
              <div className="text-center">
                <div className="font-semibold">{userData.posts}</div>
                <div className="text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{userData.followers}</div>
                <div className="text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{userData.following}</div>
                <div className="text-muted-foreground">Following</div>
              </div>
            </div>

            <p className="text-sm mb-3 line-clamp-2">{userData.bio}</p>

            <Button
              className="w-full rounded-xl"
              variant={isFollowing(userData.id) ? "outline" : "primary"}
              onClick={handleFollowToggle}
            >
              {isFollowing(userData.id) ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

