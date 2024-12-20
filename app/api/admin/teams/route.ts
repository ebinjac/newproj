import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    )
  }
}
