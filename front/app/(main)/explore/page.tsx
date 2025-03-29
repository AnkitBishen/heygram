import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

export default function ExplorePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search" className="pl-8 bg-muted" />
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-0">
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <Link key={i} href={`/post/${i + 100}`} className="aspect-square relative group">
                <Image
                  src={`/placeholder.svg?height=300&width=300`}
                  alt={`Explore post ${i + 1}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
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
                        className="lucide lucide-heart"
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
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-message-circle"
                      >
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      </svg>
                      <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="people">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-2">
                <Link href={`/profile/${i + 20}`} className="flex-shrink-0">
                  <Image
                    src={`/placeholder.svg?height=64&width=64`}
                    alt={`User ${i + 20}`}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${i + 20}`} className="font-semibold block truncate">
                    user{i + 20}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">
                    {i % 2 === 0 ? "Followed by user1 and others" : "Suggested for you"}
                  </p>
                </div>
                <button className="text-sm font-semibold text-primary">Follow</button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

