import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Help & Support</h3>
        <p className="text-sm text-muted-foreground">
          Find answers to common questions and get support.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn the basics of using the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Setting up your team</li>
              <li>Managing applications</li>
              <li>User roles and permissions</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
            <CardDescription>Common questions and answers</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Account management</li>
              <li>Team settings</li>
              <li>Security and privacy</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get help from our team</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Email: support@example.com</li>
              <li>Support hours: 24/7</li>
              <li>Response time: 24 hours</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
