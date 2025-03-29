import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"

export default function NotificationsPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4">
              {/* Today */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">Today</h2>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <NotificationItem key={i} type={i % 5} username={`user${i + 1}`} time="2h ago" />
                  ))}
                </div>
              </div>

              {/* This Week */}
              <div className="pt-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-2">This Week</h2>
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <NotificationItem key={i} type={(i + 2) % 5} username={`user${i + 6}`} time={`${i + 1}d ago`} />
                  ))}
                </div>
              </div>

              {/* Earlier */}
              <div className="pt-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-2">Earlier</h2>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <NotificationItem key={i} type={(i + 1) % 5} username={`user${i + 14}`} time={`${i + 2}w ago`} />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="mentions" className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <NotificationItem
                  key={i}
                  type={4} // Comment type
                  username={`user${i + 20}`}
                  time={`${i + 1}d ago`}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationItem({ type, username, time }: { type: number; username: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent">
      <Avatar>
        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={username} />
        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
          <p className="text-sm">
            <Link href={`/profile/${username}`} className="font-semibold hover:underline">
              {username}
            </Link>{" "}
            {type === 0 && "liked your post."}
            {type === 1 && "started following you."}
            {type === 2 && "mentioned you in a comment."}
            {type === 3 && "tagged you in a post."}
            {type === 4 && 'commented on your post: "This looks amazing! 🔥"'}
          </p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
      </div>

      {(type === 0 || type === 3 || type === 4) && (
        <Link href="/post/1" className="flex-shrink-0">
          <Image
            src="/placeholder.svg?height=60&width=60"
            alt="Post thumbnail"
            width={60}
            height={60}
            className="object-cover"
          />
        </Link>
      )}

      {type === 1 && (
        <Button size="sm" variant="outline" className="flex-shrink-0">
          Follow
        </Button>
      )}
    </div>
  )
}

