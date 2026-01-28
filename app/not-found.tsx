"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Gamepad2, Trophy, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-[calc(100dvh-49px)] flex items-center justify-center p-4 bg-linear-to-b from-background to-muted/20">
      <div className="w-full max-w-2xl text-center space-y-8">

        {/* 404 */}
        <div className="relative">
          <h1 className="text-[9rem] md:text-[13rem] font-bold text-muted-foreground/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Arena Not Found
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                This page doesn't exist in XO Arena.
                The match may be over or the link is invalid.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Link href="/">
            <Button variant="outline" className="w-full justify-start h-auto py-4 px-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Home</div>
                  <div className="text-sm text-muted-foreground">
                    Return to XO Arena
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/game">
            <Button variant="outline" className="w-full justify-start h-auto py-4 px-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Play Game</div>
                  <div className="text-sm text-muted-foreground">
                    Start a new XO match
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/" className="md:col-span-2">
            <Button variant="outline" className="w-full justify-start h-auto py-4 px-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Leaderboard</div>
                  <div className="text-sm text-muted-foreground">
                    See top players in XO Arena
                  </div>
                </div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Back */}
        <div className="pt-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
