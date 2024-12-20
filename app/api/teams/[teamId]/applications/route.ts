import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teams, applications, users } from "@/drizzle/schema";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    // Get user's email from cookie
    const cookieStore = cookies();
    const userEmail = cookieStore.get('authEmail')?.value;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First fetch the team to get its PRC group
    const team = await db.query.teams.findFirst({
      where: eq(teams.slug, params.teamId),
      columns: {
        prcGroup: true,
        id: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this team
    const user = await db.query.users.findFirst({
      where: eq(users.email, userEmail),
      columns: {
        groups: true,
      },
    });

    const userGroups = user?.groups || [];
    const hasAccess = userGroups.includes(team.prcGroup);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const [newApplication] = await db.insert(applications)
      .values({
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
        teamId: team.id,
      })
      .returning();

    return NextResponse.json(newApplication);
  } catch (error) {
    console.error("Failed to create application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
