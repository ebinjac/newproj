"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TeamSwitcher } from "./team-switcher"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <TeamSwitcher />
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Overview
      </Link>
      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/settings")
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Settings
      </Link>
    </nav>
  )
}
