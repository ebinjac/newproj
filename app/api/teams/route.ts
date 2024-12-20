import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: {
        approved: true
      },
      select: {
        id: true,
        slug: true,
        teamName: true,
        prcGroup: true,
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Failed to fetch teams:", error)
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const team = await prisma.team.create({
      data: {
        ...data,
        approved: false,
      },
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error("Failed to create team:", error)
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    )
  }
}
