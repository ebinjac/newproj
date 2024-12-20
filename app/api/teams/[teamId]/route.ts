import { NextResponse } from "next/server";
import { db, queries } from "@/lib/db";
import { teams, applications } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const team = await queries.teams.findFirst({
      where: eq(teams.slug, params.teamId),
      with: {
        applications: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Failed to fetch team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const team = await queries.teams.findFirst({
      where: eq(teams.slug, params.teamId),
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const updatedTeam = await db
      .update(teams)
      .set({
        teamName: body.teamName,
        vpName: body.vpName,
        directorName: body.directorName,
        email: body.email,
        slack: body.slack,
      })
      .where(eq(teams.slug, params.teamId))
      .returning();

    return NextResponse.json(updatedTeam[0]);
  } catch (error) {
    console.error("Failed to update team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}
