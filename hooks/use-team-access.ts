'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/types/auth'

export function useTeamAccess(teamId: string) {
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}/access`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setHasAccess(data.hasAccess)
        } else {
          setHasAccess(false)
        }
      } catch (error) {
        console.error('Error checking team access:', error)
        setHasAccess(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [teamId])

  return { hasAccess, isLoading }
}

export function checkTeamAccess(user: User, teamId: string): boolean {
  return user.groups.some(group => group === `${teamId}-prc`)
}
