import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function PendingPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Registration Pending</CardTitle>
            <CardDescription>
              Your team registration request has been submitted and is pending approval.
              You will be notified once an admin reviews your request.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
