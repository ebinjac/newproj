import { NextRequest, NextResponse } from 'next/server'
import { checkTeamAccess } from '@/hooks/use-team-access'
import type { User } from '@/types/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const userInfo = request.headers.get('x-user-info')
    if (!userInfo) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user: User = JSON.parse(userInfo)
    const hasAccess = checkTeamAccess(user, params.teamId)

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error('Error checking team access:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
