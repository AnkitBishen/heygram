"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"

interface UserProfilePageProps {
  params: {
    username: string
  }
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = params
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const [userData, setUserData] = useState({
    name: "User Name",
    bio: "This is a bio description for this user. #photography #travel",
    website: "www.example.com",
    postsCount: Math.floor(Math.random() * 200) + 50,
    followersCount: Math.floor(Math.random() * 2000) + 500,
    followingCount: Math.floor(Math.random() * 1000) + 200,
  })

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="flex-shrink-0">
          <div className="relative h-24 w-24 md:h-36 md:w-36">
            <Image
              src={`/placeholder.svg?height=150&width=150&text=${username}`}
              alt={`${username}'s profile`}
              width={150}
              height={150}
              className="rounded-full object-cover border-2 border-background"
            />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-xl font-semibold">{username}</h1>
            <div className="flex gap-2 justify-center md:justify-start">
              {isFollowing ? (
                <Button variant="outline" className="rounded-full" onClick={toggleFollow}>
                  Following
                </Button>
              ) : (
                <Button className="rounded-full" onClick={toggleFollow}>
                  Follow
                </Button>
              )}
              <Button variant="outline" className="rounded-full" onClick={() => router.push(`/messages/${username}`)}>
                Message
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
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
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-start gap-6 mb-4">
            <div className="text-center">
              <span className="font-semibold">{userData.postsCount}</span>
              <p className="text-sm">posts</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">{userData.followersCount}</span>
              <p className="text-sm">followers</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">{userData.followingCount}</span>
              <p className="text-sm">following</p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold">{userData.name}</h2>
            <p className="text-sm">{userData.bio}</p>
            <Link href={`https://${userData.website}`} className="text-sm text-primary font-medium">
              {userData.website}
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
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
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <line x1="9" x2="9" y1="3" y2="21"></line>
              <line x1="15" x2="15" y1="3" y2="21"></line>
              <line x1="3" x2="21" y1="9" y2="9"></line>
              <line x1="3" x2="21" y1="15" y2="15"></line>
            </svg>
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex items-center gap-2">
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
            >
              <path d="m14.5 2-6 6 6 6 6-6-6-6Z"></path>
              <path d="m14.5 22-6-6 6-6 6 6-6 6Z"></path>
            </svg>
            <span className="hidden sm:inline">Reels</span>
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2">
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
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
              <path d="M7 7h.01"></path>
            </svg>
            <span className="hidden sm:inline">Tagged</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Link
                key={i}
                href={`/post/${username}-${i + 1}`}
                className="aspect-square relative group overflow-hidden rounded-lg md:rounded-xl"
              >
                <Image
                  src={`/placeholder.svg?height=300&width=300&text=Post${i + 1}`}
                  alt={`${username}'s post ${i + 1}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="none"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      <span className="text-sm">{Math.floor(Math.random() * 1000)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="none"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reels" className="mt-6">
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Link
                key={i}
                href={`/reel/${username}-${i + 1}`}
                className="aspect-[9/16] relative group overflow-hidden rounded-lg md:rounded-xl"
              >
                <Image
                  src={`/placeholder.svg?height=400&width=225&text=Reel${i + 1}`}
                  alt={`${username}'s reel ${i + 1}`}
                  width={225}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="none"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      <span className="text-sm">{Math.floor(Math.random() * 1000)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="none"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tagged" className="mt-6">
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Link
                key={i}
                href={`/post/tagged-${username}-${i + 1}`}
                className="aspect-square relative group overflow-hidden rounded-lg md:rounded-xl"
              >
                <Image
                  src={`/placeholder.svg?height=300&width=300&text=Tagged${i + 1}`}
                  alt={`${username} tagged in post ${i + 1}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="none"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      <span className="text-sm">{Math.floor(Math.random() * 1000)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="none"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

