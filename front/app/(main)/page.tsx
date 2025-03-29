import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Bookmark, Send, MoreHorizontal } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 space-y-4 p-4 md:max-w-2xl md:mx-auto">
        {/* Stories */}
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max space-x-4 p-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Link key={i} href={`/stories/${i + 1}`} className="flex flex-col items-center space-y-1">
                    <div className="relative h-16 w-16 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-0.5">
                      <Avatar className="h-full w-full border-2 border-background">
                        <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={`User ${i + 1}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-xs">user{i + 1}</span>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Posts */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={`User ${i + 1}`} />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div className="grid">
                <Link href={`/profile/${i + 1}`} className="font-semibold">
                  user{i + 1}
                </Link>
                <span className="text-xs text-muted-foreground">Location {i + 1}</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Link href={`/post/${i + 1}`}>
                <Image
                  src={`/placeholder.svg?height=600&width=600`}
                  alt={`Post ${i + 1}`}
                  width={600}
                  height={600}
                  className="aspect-square object-cover"
                />
              </Link>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <div className="flex w-full items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-2 text-sm font-semibold">{Math.floor(Math.random() * 1000)} likes</div>
              <div className="mt-1 text-sm">
                <Link href={`/profile/${i + 1}`} className="font-semibold">
                  user{i + 1}
                </Link>{" "}
                This is a caption for post {i + 1}. #heygram #socialmedia
              </div>
              <Link href={`/post/${i + 1}`} className="mt-1 text-xs text-muted-foreground">
                View all {Math.floor(Math.random() * 100)} comments
              </Link>
              <div className="mt-2 text-xs text-muted-foreground">{Math.floor(Math.random() * 24)} HOURS AGO</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Suggestions - Only visible on desktop */}
      <div className="hidden md:block md:w-80 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="grid">
            <Link href="/profile" className="font-semibold">
              username
            </Link>
            <span className="text-sm text-muted-foreground">Your Name</span>
          </div>
          <Button variant="link" size="sm" className="ml-auto">
            Switch
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Suggestions For You</h3>
            <Button variant="link" size="sm">
              See All
            </Button>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={`Suggested User ${i + 1}`} />
                  <AvatarFallback>S{i}</AvatarFallback>
                </Avatar>
                <div className="grid">
                  <Link href={`/profile/${i + 10}`} className="text-sm font-semibold">
                    suggested{i + 1}
                  </Link>
                  <span className="text-xs text-muted-foreground">Followed by user{i + 3}</span>
                </div>
                <Button variant="link" size="sm" className="ml-auto">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
            <Link href="#" className="hover:underline">
              About
            </Link>
            <Link href="#" className="hover:underline">
              Help
            </Link>
            <Link href="#" className="hover:underline">
              Press
            </Link>
            <Link href="#" className="hover:underline">
              API
            </Link>
            <Link href="#" className="hover:underline">
              Jobs
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Locations
            </Link>
            <Link href="#" className="hover:underline">
              Language
            </Link>
          </div>
          <div>© 2024 HEYGRAM</div>
        </div>
      </div>
    </div>
  )
}

