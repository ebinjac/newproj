import type { Metadata } from "next";
import { GeistMono } from "geist/font";
import "./globals.css";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";
import { AuthProvider } from "@/providers/auth-provider";
import { Inter as FontSans } from "next/font/google"
import { Outfit as FontHeading } from "next/font/google"

const geistMono = GeistMono.variable;

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Ensemble",
  description: "Ensemble - Your Team Collaboration Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono} ${fontSans.variable} ${fontHeading.variable} font-sans`}>
        <AuthProvider>
          <div className="min-h-screen flex-col">
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                  <UserNav />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
