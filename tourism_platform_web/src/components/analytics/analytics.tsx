'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react"
import { AnalyticsOverview } from "@/components/analytics/tabs/analytics-overview"
import { RevenueReports } from "@/components/analytics/tabs/revenue-reports"

export function Analytics() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    {
      id: "overview",
      label: "Resumen",
      icon: BarChart3,
      component: <AnalyticsOverview/>
    },
    {
      id: "revenue",
      label: "Ingresos",
      icon: DollarSign,
      component: <RevenueReports/>
    },
    {
      id: "customers",
      label: "Clientes",
      icon: Users,
      component: <div className="p-8 text-center text-gray-500">Módulo de análisis de clientes próximamente</div>
    },
    {
      id: "destinations",
      label: "Destinos",
      icon: MapPin,
      component: <div className="p-8 text-center text-gray-500">Módulo de análisis de destinos próximamente</div>
    },
    {
      id: "trends",
      label: "Tendencias",
      icon: TrendingUp,
      component: <div className="p-8 text-center text-gray-500">Módulo de análisis de tendencias próximamente</div>
    },
    {
      id: "forecasting",
      label: "Pronósticos",
      icon: Calendar,
      component: <div className="p-8 text-center text-gray-500">Módulo de pronósticos próximamente</div>
    }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Tab Content */}
      <div>
        {activeTabData?.component}
      </div>
    </div>
  )
}