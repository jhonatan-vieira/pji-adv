"use client"

import { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: ReactNode
  activeModule?: string
}

export function DashboardLayout({ children, activeModule }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar activeModule={activeModule} />
      <div className="lg:pl-64">
        <Header />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  )
}
