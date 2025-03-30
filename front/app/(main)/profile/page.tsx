"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

interface Post {
  id: number
  imageUrl: string
  likes: number
  comments: number
  timestamp: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<string>("posts")
  const [posts, setPosts] = useState<Post[]>([])
  const [savedPosts, setSavedPosts] = useState<Post[]>([])
  const [taggedPosts, setTaggedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simulate fetching posts
    const fetchPosts = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate sample posts
      const generatePosts = (count: number, offset = 0): Post[] =>
        Array.from({ length: count }).map((_, i) => ({
          id: offset + i + 1,
          imageUrl: `/placeholder.svg?height=300&width=300`,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
        }))

      setPosts(generatePosts(12))
      setSavedPosts(generatePosts(6, 50))
      setTaggedPosts(generatePosts(3, 80))
      setIsLoading(false)
    }

    fetchPosts()
  }, [])

  if (!user) return null

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="flex-shrink-0">
          <div className="relative h-24 w-24 md:h-36 md:w-36">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt="Profile"
              width={150}
              height={150}
              className="rounded-full object-cover border-2 border-background"
            />
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 border-2 border-background">
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
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{user.username}</h1>
              {user.isVerified && (
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
                  className="text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              )}
            </div>
            <div className="flex gap-2 justify-center md:justify-start">
              <Button className="rounded-full" href="/settings/edit-profile">
                Edit Profile
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
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-start gap-6 mb-4">
            <div className="text-center">
              <span className="font-semibold">{user.posts}</span>
              <p className="text-sm">posts</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">{user.followers}</span>
              <p className="text-sm">followers</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">{user.following}</span>
              <p className="text-sm">following</p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-sm">{user.bio}</p>
            <Link
              href={user.website}
              className="text-sm text-primary font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.website}
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
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
          <TabsTrigger value="saved" className="flex items-center gap-2">
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
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
            </svg>
            <span className="hidden sm:inline">Saved</span>
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
          {isLoading ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg md:rounded-xl"></div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {posts.map((post) => (
                <PostGridItem key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 text-muted-foreground"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <h3 className="text-lg font-medium">No Posts Yet</h3>
              <p className="text-muted-foreground mt-1">Share photos and videos to start posting</p>
              <Button className="mt-4 rounded-full">Share your first post</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg md:rounded-xl"></div>
              ))}
            </div>
          ) : savedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {savedPosts.map((post) => (
                <PostGridItem key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 text-muted-foreground"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              </svg>
              <h3 className="text-lg font-medium">No Saved Posts</h3>
              <p className="text-muted-foreground mt-1">Save posts to view them later</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tagged" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg md:rounded-xl"></div>
              ))}
            </div>
          ) : taggedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {taggedPosts.map((post) => (
                <PostGridItem key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 text-muted-foreground"
              >
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                <path d="M7 7h.01"></path>
              </svg>
              <h3 className="text-lg font-medium">No Tagged Posts</h3>
              <p className="text-muted-foreground mt-1">Photos you're tagged in will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PostGridItemProps {
  post: Post
}

function PostGridItem({ post }: PostGridItemProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  return (
    <Link
      href={`/post/${post.id}`}
      className="aspect-square relative group overflow-hidden rounded-lg md:rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={post.imageUrl || "/placeholder.svg"}
        alt={`Post ${post.id}`}
        width={300}
        height={300}
        className={`object-cover w-full h-full transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}
      />
      <div
        className={`absolute inset-0 bg-black/40 flex items-center justify-center text-white transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
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
            <span className="text-sm">{post.likes}</span>
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
            <span className="text-sm">{post.comments}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

