import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params
    const { action } = await request.json()

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      )
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }

    if (action === "approve") {
      const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: { approved: true },
      })
      return NextResponse.json(updatedTeam)
    } else {
      // For reject action, we'll delete the team
      await prisma.team.delete({
        where: { id: teamId },
      })
      return NextResponse.json({ message: "Team rejected and deleted" })
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    )
  }
}
