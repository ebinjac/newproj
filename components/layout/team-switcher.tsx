"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
  GearIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"

interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

type Team = {
  id: string
  slug: string
  teamName: string
  prcGroup: string
}

export function TeamSwitcher() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [open, setOpen] = React.useState(false)
  const [teams, setTeams] = React.useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null)

  // Fetch teams from the API
  React.useEffect(() => {
    if (user) {
      console.log('User in TeamSwitcher:', user) // Debug log
      fetch('/api/teams')
        .then(res => res.json())
        .then(data => {
          console.log('All teams:', data) // Debug log
          // Filter teams based on user's groups
          const userTeams = data.filter(team => 
            user.groups.includes(team.prcGroup)
          )
          console.log('User teams:', userTeams) // Debug log
          setTeams(userTeams)
          
          // Set initial selected team based on URL or first available team
          const teamSlug = params?.teamId as string
          console.log('Team slug from URL:', teamSlug) // Debug log
          const currentTeam = userTeams.find(team => team.slug === teamSlug) || userTeams[0]
          console.log('Selected team:', currentTeam) // Debug log
          setSelectedTeam(currentTeam)
        })
        .catch(error => {
          console.error('Failed to fetch teams:', error)
        })
    }
  }, [user, params?.teamId])

  const handleTeamSelect = React.useCallback((team: Team) => {
    setSelectedTeam(team)
    setOpen(false)
    router.push(`/teams/${team.slug}`)
  }, [router])

  if (!user) {
    return (
      <Button
        variant="outline"
        role="combobox"
        className="w-[200px] justify-between"
        disabled
      >
        Please login first
      </Button>
    )
  }

  if (teams.length === 0) {
    return (
      <Button
        variant="outline"
        role="combobox"
        className="w-[200px] justify-between"
        disabled
      >
        No teams available
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className="w-[200px] justify-between"
        >
          {selectedTeam?.teamName || "Select team"}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup heading="Teams">
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={() => handleTeamSelect(team)}
                  className="text-sm"
                >
                  <span className="flex-grow">{team.teamName}</span>
                  <div className="ml-auto flex items-center">
                    {selectedTeam?.id === team.id && (
                      <CheckIcon className="h-4 w-4 mr-2" />
                    )}
                    <Link 
                      href={`/teams/${team.slug}/settings`}
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-50 hover:opacity-100"
                    >
                      <GearIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <Link href="/teams/register">
                <CommandItem className="cursor-pointer">
                  <PlusCircledIcon className="mr-2 h-5 w-5" />
                  Create Team
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
