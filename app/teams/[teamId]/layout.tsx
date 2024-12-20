"use client"

import { useParams } from "next/navigation"

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="flex-1">{children}</div>
    </div>
  )
}
