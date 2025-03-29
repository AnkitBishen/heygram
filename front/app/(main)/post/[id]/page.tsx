import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Bookmark, Send, MoreHorizontal } from "lucide-react"

export default function PostPage({ params }: { params: { id: string } }) {
  const postId = params.id

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="grid md:grid-cols-5 border rounded-md overflow-hidden">
        {/* Post Image */}
        <div className="md:col-span-3 aspect-square relative">
          <Image src="/placeholder.svg?height=600&width=600" alt={`Post ${postId}`} fill className="object-cover" />
        </div>

        {/* Post Details */}
        <div className="md:col-span-2 flex flex-col">
          {/* Post Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Link href="/profile" className="font-semibold text-sm">
                username
              </Link>
              <p className="text-xs text-muted-foreground">Location</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Comments */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Post Caption */}
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <Link href="/profile" className="font-semibold">
                      username
                    </Link>{" "}
                    This is the caption for post {postId}. #heygram #socialmedia
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
              </div>

              {/* Comments */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={`User ${i + 1}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <Link href={`/profile/${i + 1}`} className="font-semibold">
                        user{i + 1}
                      </Link>{" "}
                      {i % 3 === 0
                        ? "This looks amazing! 🔥"
                        : i % 3 === 1
                          ? "Great shot! Love the composition."
                          : "Thanks for sharing this!"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{i + 1}h ago</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Post Actions */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Button variant="ghost" size="icon">
                <Heart className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <Send className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Bookmark className="h-6 w-6" />
              </Button>
            </div>
            <p className="font-semibold text-sm mb-1">1,234 likes</p>
            <p className="text-xs text-muted-foreground mb-4">2 DAYS AGO</p>

            {/* Add Comment */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-full px-3">
                😊
              </Button>
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <Button variant="ghost" size="sm" className="text-primary font-semibold">
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

