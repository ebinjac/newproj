import { TeamRegistrationForm } from "@/components/team-registration-form"

export default function TeamRegistrationPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Team Registration</h1>
        <TeamRegistrationForm />
      </div>
    </div>
  )
}
