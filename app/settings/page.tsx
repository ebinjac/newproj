"use client"

import { Separator } from "@/components/ui/separator"
import { TeamForm } from "./team-form"
import { useParams } from "next/navigation"

export default function SettingsPage() {
  const params = useParams()
  const teamId = params?.teamId as string

  if (!teamId) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Team Settings</h3>
          <p className="text-sm text-muted-foreground">
            Please select a team from the team switcher above.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Team Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your team preferences and applications.
        </p>
      </div>
      <Separator />
      <TeamForm teamId={teamId} />
    </div>
  )
}
