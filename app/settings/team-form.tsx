"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTeamAccess } from "@/hooks/use-team-access"
import { useAuth } from "@/providers/auth-provider"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const teamFormSchema = z.object({
  name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  description: z.string().optional(),
})

type TeamFormValues = z.infer<typeof teamFormSchema>

const defaultValues: Partial<TeamFormValues> = {
  name: "",
  description: "",
}

interface TeamFormProps {
  teamId: string
}

export function TeamForm({ teamId }: TeamFormProps) {
  const { hasAccess, isLoading } = useTeamAccess(teamId)
  const { user } = useAuth()

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues,
  })

  if (!user) {
    return null // Let the middleware handle the redirect
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="text-destructive">
        You do not have access to this team.
      </div>
    )
  }

  async function onSubmit(data: TeamFormValues) {
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update team')
      }

      toast({
        title: "Team updated successfully",
        description: "Your team information has been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team information.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter team name" {...field} />
              </FormControl>
              <FormDescription>
                This is your team's display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter team description" {...field} />
              </FormControl>
              <FormDescription>
                A brief description of your team (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
