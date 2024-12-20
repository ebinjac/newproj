"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

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

const teamFormSchema = z.object({
  teamName: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens.",
  }),
  prcGroup: z.string().min(2, {
    message: "PRC group must be at least 2 characters.",
  }),
  vpName: z.string().min(2, {
    message: "VP name must be at least 2 characters.",
  }),
  directorName: z.string().min(2, {
    message: "Director name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  slack: z.string().min(1, {
    message: "Slack channel is required.",
  }),
})

type TeamFormValues = z.infer<typeof teamFormSchema>

export function TeamRegistrationForm() {
  const router = useRouter()
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: "",
      slug: "",
      prcGroup: "",
      vpName: "",
      directorName: "",
      email: "",
      slack: "",
    },
  })

  async function onSubmit(data: TeamFormValues) {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          requestedBy: "current-user", // This should be replaced with actual user info
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit team registration");
      }

      const team = await response.json();

      toast({
        title: "Registration submitted",
        description: "Your team registration request has been submitted for approval.",
      });

      router.push("/team/pending");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem submitting your registration.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter team name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="team-name" {...field} />
              </FormControl>
              <FormDescription>
                This will be used in URLs. Use lowercase letters, numbers, and hyphens only.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prcGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PRC Group</FormLabel>
              <FormControl>
                <Input placeholder="Enter PRC group" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vpName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VP Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter VP name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="directorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Director Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter director name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter team email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slack Channel</FormLabel>
              <FormControl>
                <Input placeholder="Enter slack channel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Registration</Button>
      </form>
    </Form>
  )
}
