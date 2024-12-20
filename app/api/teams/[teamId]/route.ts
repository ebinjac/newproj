import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    // First fetch the team
    const team = await prisma.team.findUnique({
      where: {
        slug: params.teamId,
      },
      include: {
        applications: true,
      },
    })

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error("Failed to fetch team:", error)
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const team = await prisma.team.findUnique({
      where: {
        slug: params.teamId,
      },
    })

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      )
    }

    const body = await req.json()

    const updatedTeam = await prisma.team.update({
      where: {
        slug: params.teamId,
      },
      data: {
        teamName: body.teamName,
        vpName: body.vpName,
        directorName: body.directorName,
        email: body.email,
        slack: body.slack,
      },
      include: {
        applications: true,
      },
    })

    return NextResponse.json(updatedTeam)
  } catch (error) {
    console.error("Failed to update team:", error)
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    )
  }
}
