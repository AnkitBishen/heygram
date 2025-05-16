"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Instagram } from "lucide-react"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate registration
    const registerRes = await new Promise((resolve) => {
      	// call api
		fetch("http://localhost:8001/auth/v1/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: (e.target as any).fullName.value,
				username: (e.target as any).username.value,
				dob: (e.target as any).dob.value,
				email: (e.target as any).email.value,
				password: (e.target as any).password.value,
			}), 
		}). then((res) => {
			console.log(res)
			if (res.ok) {
				resolve(true)
			}
		}).catch((err) => {
			resolve(false)
		})
    })

	if(registerRes){
		router.push("/login")
	}else{
		setIsLoading(false)
	}
  }

  return (
	<div className="flex min-h-screen items-center justify-center px-4">
		<div className="w-full max-w-md space-y-6">
			<div className="space-y-2 text-center">
				<div className="flex justify-center">
					<Instagram className="h-12 w-12" />
				</div>
				<h1 className="text-3xl font-bold">Heygram</h1>
				<p className="text-gray-500 dark:text-gray-400">
					Create an account to get started
				</p>
			</div>
			<div className="space-y-4">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="fullName">Full Name</Label>
						<Input
							id="fullName"
							placeholder="Enter your full name"
							required
							type="text"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="fullName">Date of Birth</Label>
						<Input
							id="dob"
							placeholder="Enter your date of birth"
							required
							type="text"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							placeholder="Enter your email"
							required
							type="email"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							placeholder="Choose a username"
							required
							type="text"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							placeholder="Create a password"
							required
							type="password"
						/>
					</div>
					<Button
						className="w-full"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? "Creating account..." : "Sign Up"}
					</Button>
				</form>
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<Separator className="w-full" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>
				<div className="grid gap-2">
					<Button variant="outline" className="w-full">
						Continue with Google
					</Button>
					<Button variant="outline" className="w-full">
						Continue with Facebook
					</Button>
				</div>
			</div>
			<div className="text-center text-sm">
				Already have an account?{" "}
				<Link
					href="/login"
					className="text-primary underline-offset-4 hover:underline"
				>
					Sign in
				</Link>
			</div>
		</div>
	</div>
  );
}

