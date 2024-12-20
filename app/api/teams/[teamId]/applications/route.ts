import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    // Get user's email from cookie
    const cookieStore = cookies()
    const userEmail = cookieStore.get('authEmail')?.value

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // First fetch the team to get its PRC group
    const team = await prisma.team.findUnique({
      where: {
        slug: params.teamId,
      },
      select: {
        prcGroup: true,
      },
    })

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this team
    const userGroups = (await prisma.user.findUnique({
      where: { email: userEmail },
      select: { groups: true }
    }))?.groups || []

    const hasAccess = userGroups.includes(team.prcGroup)

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const body = await req.json()

    const newApplication = await prisma.application.create({
      data: {
        appName: body.appName,
        carId: body.carId,
        description: body.description,
        vp: body.vp,
        dir: body.dir,
        engDir: body.engDir,
        engDir2: body.engDir2,
        slack: body.slack,
        email: body.email,
        snowGroup: body.snowGroup,
        team: {
          connect: {
            slug: params.teamId,
          },
        },
      },
    })

    return NextResponse.json(newApplication)
  } catch (error) {
    console.error("Failed to create application:", error)
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    )
  }
}
