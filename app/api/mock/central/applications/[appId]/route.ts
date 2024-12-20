import { NextResponse } from "next/server"

// Mock Central API data
const mockCentralData = {
  'APP123': {
    appName: 'Sample App 1',
    description: 'A sample application from Central',
    vp: 'John Smith',
    dir: 'Jane Doe',
    engDir: 'Bob Wilson',
    slack: '#app123-central',
    email: 'app123@central.com',
  },
  'APP456': {
    appName: 'Sample App 2',
    description: 'Another sample application from Central',
    vp: 'Sarah Johnson',
    dir: 'Mike Brown',
    engDir: 'Alice Green',
    slack: '#app456-central',
    email: 'app456@central.com',
  },
}

export async function GET(
  req: Request,
  { params }: { params: { appId: string } }
) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const appData = mockCentralData[params.appId as keyof typeof mockCentralData]

  if (!appData) {
    return NextResponse.json(
      { error: "Application not found in Central" },
      { status: 404 }
    )
  }

  return NextResponse.json(appData)
}
