import { memo } from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  color?: "blue" | "green" | "gray"
}

export const StatsCard = memo(function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = "blue" 
}: StatsCardProps) {
  const colorClasses = {
    blue: "bg-[#0052CC]/10 text-[#0052CC]",
    green: "bg-[#36B37E]/10 text-[#36B37E]",
    gray: "bg-[#42526E]/10 text-[#42526E]"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-[#42526E] font-medium">{title}</p>
            <p className="text-3xl font-bold text-[#0052CC]">{value}</p>
            {trend && (
              <p className={cn(
                "text-sm font-medium",
                trend.positive ? "text-[#36B37E]" : "text-red-500"
              )}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            colorClasses[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
