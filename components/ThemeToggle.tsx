"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 px-3 h-10 rounded-3xl">
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {isDark ? "Dark" : "Light"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="rounded-md shadow-md p-1 bg-popover border border-border">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`px-4 py-2 rounded-md cursor-pointer ${resolvedTheme === "light"
            ? "bg-accent/20"
            : "hover:bg-accent/10"
            }`}
        >
          ☀️ Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`px-4 py-2 rounded-md cursor-pointer ${resolvedTheme === "dark"
            ? "bg-accent/20"
            : "hover:bg-accent/10"
            }`}
        >
          🌙 Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`px-4 py-2 rounded-md cursor-pointer ${theme === "system"
            ? "bg-accent/20"
            : "hover:bg-accent/10"
            }`}
        >
          🖥 System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
