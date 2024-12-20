"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

interface Team {
  id: string
  teamName: string
  prcGroup: string
  vpName: string
  directorName: string
  email: string
  slack: string
  requestedBy: string
  approved: boolean
  createdAt: string
}

export default function AdminPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/admin/teams")
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTeamAction = async (teamId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("Failed to update team status")
      }

      toast({
        title: "Success",
        description: `Team ${action}ed successfully`,
      })

      // Refresh teams list
      fetchTeams()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} team`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Team Registration Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>PRC Group</TableHead>
            <TableHead>VP Name</TableHead>
            <TableHead>Director</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.teamName}</TableCell>
              <TableCell>{team.prcGroup}</TableCell>
              <TableCell>{team.vpName}</TableCell>
              <TableCell>{team.directorName}</TableCell>
              <TableCell>{team.requestedBy}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    team.approved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {team.approved ? "Approved" : "Pending"}
                </span>
              </TableCell>
              <TableCell>
                {!team.approved && (
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleTeamAction(team.id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleTeamAction(team.id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
