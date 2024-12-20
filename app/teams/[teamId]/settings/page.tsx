'use client'

import { useParams, useRouter } from "next/navigation"
import { useAuthBlue } from 'ssoauthblue'
import { useEffect, useState } from "react"
import type { Team, Application } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"

const teamFormSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  vpName: z.string().min(1, "VP name is required"),
  directorName: z.string().min(1, "Director name is required"),
  email: z.string().email("Invalid email address"),
  slack: z.string().min(1, "Slack channel is required"),
})

const applicationFormSchema = z.object({
  appId: z.string().min(1, "Application ID is required"),
  appName: z.string().min(1, "Application name is required"),
  carId: z.string().min(1, "CAR ID is required"),
  description: z.string().min(1, "Description is required"),
  vp: z.string().min(1, "VP name is required"),
  dir: z.string().min(1, "Director name is required"),
  engDir: z.string().min(1, "Engineering Director is required"),
  engDir2: z.string().optional(),
  slack: z.string().min(1, "Slack channel is required"),
  email: z.string().email("Invalid email address"),
  snowGroup: z.string().min(1, "Snow group is required"),
})

type TeamFormValues = z.infer<typeof teamFormSchema>
type ApplicationFormValues = z.infer<typeof applicationFormSchema>

export default function TeamSettingsPage() {
  const router = useRouter()
  const params = useParams()
  const teamId = params?.teamId as string
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<Team | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [activeTab, setActiveTab] = useState<string>("details")
  const user = useAuthBlue()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
          <p className="text-sm text-gray-500">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  const teamForm = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
  })

  useEffect(() => {
    if (teamId && user) {
      setLoading(true)
      fetch(`/api/teams/${teamId}`)
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Failed to fetch team')
          }
          return res.json()
        })
        .then(data => {
          if (data) {
            if (!user.groups.includes(data.prcGroup)) {
              toast({
                title: "Access Denied",
                description: "You don't have permission to view this team's settings",
                variant: "destructive",
              })
              router.push('/teams')
              return
            }

            setTeam(data)
            setApplications(data.applications || [])
            teamForm.reset({
              teamName: data.teamName,
              vpName: data.vpName,
              directorName: data.directorName,
              email: data.email,
              slack: data.slack,
            })
          }
          setLoading(false)
        })
        .catch(error => {
          console.error('Failed to fetch team:', error)
          toast({
            title: "Error",
            description: error.message || "Failed to fetch team details",
            variant: "destructive",
          })
          setLoading(false)
        })
    }
  }, [teamId, user, router, toast, teamForm])

  const onSubmit = async (values: TeamFormValues) => {
    if (!teamId || !user || !team || !user.groups.includes(team.prcGroup)) return

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update team')
      }

      toast({
        title: "Success",
        description: "Team settings updated successfully",
      })
    } catch (error) {
      console.error('Failed to update team:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update team settings",
        variant: "destructive",
      })
    }
  }

  const applicationForm = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      appId: "",
      appName: "",
      carId: "",
      description: "",
      vp: "",
      dir: "",
      engDir: "",
      engDir2: "",
      slack: "",
      email: "",
      snowGroup: "",
    },
  })

  const fetchCentralAppData = async (appId: string) => {
    try {
      const response = await fetch(`/api/mock/central/applications/${appId}`)
      if (!response.ok) {
        throw new Error('Application not found in Central')
      }
      const data = await response.json()
      
      applicationForm.reset({
        ...applicationForm.getValues(),
        appId,
        appName: data.appName,
        description: data.description,
        vp: data.vp,
        dir: data.dir,
        engDir: data.engDir,
        slack: data.slack,
        email: data.email,
      })

      toast({
        title: "Success",
        description: "Application details fetched from Central",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch application details from Central",
        variant: "destructive",
      })
    }
  }

  const onApplicationSubmit = async (data: ApplicationFormValues) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to add application')
      }

      const newApp = await response.json()
      setApplications([...applications, newApp])
      applicationForm.reset()

      toast({
        title: "Success",
        description: "Application added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add application",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{team?.teamName || 'Team Settings'}</h1>
          <p className="text-sm text-gray-500">Manage your team's settings and applications.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Loading team details...</h2>
            <p className="text-sm text-gray-500">Please wait while we fetch your team's information.</p>
          </div>
        </div>
      ) : team ? (
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Team Details</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Edit Team Details</CardTitle>
                <CardDescription>Make changes to your team information here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...teamForm}>
                  <form onSubmit={teamForm.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={teamForm.control}
                      name="teamName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="vpName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VP Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="directorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Director Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamForm.control}
                      name="slack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slack Channel</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>Manage your team's applications.</CardDescription>
                  </div>
                  <Dialog open={false} onOpenChange={() => {}}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Application
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Application</DialogTitle>
                        <DialogDescription>
                          Enter the application details below. You can fetch details from Central using the application ID.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...applicationForm}>
                        <form onSubmit={applicationForm.handleSubmit(onApplicationSubmit)} className="space-y-4">
                          <div className="flex gap-4">
                            <FormField
                              control={applicationForm.control}
                              name="appId"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Application ID</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <Input {...field} placeholder="e.g., APP123" />
                                      <Button 
                                        type="button"
                                        variant="outline"
                                        onClick={() => fetchCentralAppData(field.value)}
                                      >
                                        Fetch from Central
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={applicationForm.control}
                            name="appName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Application Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={applicationForm.control}
                            name="carId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CAR ID</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={applicationForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={applicationForm.control}
                              name="vp"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>VP</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={applicationForm.control}
                              name="dir"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Director</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={applicationForm.control}
                              name="engDir"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Engineering Director</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={applicationForm.control}
                              name="engDir2"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Engineering Director 2 (Optional)</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={applicationForm.control}
                            name="slack"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Slack Channel</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={applicationForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={applicationForm.control}
                            name="snowGroup"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Snow Group</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">Add Application</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id}>
                      <CardHeader>
                        <CardTitle>{app.appName}</CardTitle>
                        <CardDescription>{app.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>CAR ID</Label>
                            <div className="text-sm">{app.carId}</div>
                          </div>
                          <div>
                            <Label>Snow Group</Label>
                            <div className="text-sm">{app.snowGroup}</div>
                          </div>
                          <div>
                            <Label>VP</Label>
                            <div className="text-sm">{app.vp}</div>
                          </div>
                          <div>
                            <Label>Director</Label>
                            <div className="text-sm">{app.dir}</div>
                          </div>
                          <div>
                            <Label>Engineering Director</Label>
                            <div className="text-sm">{app.engDir}</div>
                          </div>
                          {app.engDir2 && (
                            <div>
                              <Label>Engineering Director 2</Label>
                              <div className="text-sm">{app.engDir2}</div>
                            </div>
                          )}
                          <div>
                            <Label>Slack Channel</Label>
                            <div className="text-sm">{app.slack}</div>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <div className="text-sm">{app.email}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">Access Denied</h2>
            <p className="text-sm text-gray-500">You don't have permission to view this team's settings.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push('/teams')}
            >
              Go Back to Teams
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
