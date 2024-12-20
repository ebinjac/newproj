import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teams } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allTeams = await db
      .select({
        id: teams.id,
        slug: teams.slug,
        teamName: teams.teamName,
        prcGroup: teams.prcGroup,
      })
      .from(teams)
      .where(eq(teams.approved, true));

    return NextResponse.json(allTeams);
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const team = await db.insert(teams).values({
      ...data,
      approved: false,
    }).returning();

    return NextResponse.json(team[0]);
  } catch (error) {
    console.error("Failed to create team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
