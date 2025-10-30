'use client'

import { useState } from 'react'
import { usePollution } from '@/shared/hooks/use-pollution'
import { useAuth } from '@/shared/hooks/use-auth'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs'
import { DashboardStats } from '@/shared/components/dashboard/DashboardStats'
import { PollutionCard } from '@/shared/components/dashboard/PollutionCard'
import { PollutionStatus, UserRole } from '@/shared/types'
import { Download } from 'lucide-react'
import { pollutionService } from '@/shared/api/pollution.service'
import { toast } from 'sonner'
import styles from '@/shared/styles/dashboard.module.css'

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<PollutionStatus>(PollutionStatus.REPORTED)
  const { points, stats, updatePoint } = usePollution({ status: activeTab })

  const canManage = user?.role === UserRole.ACTIVIST || user?.role === UserRole.ADMIN

  if (canManage) {
    return (
      <div className={styles.container}>
        <Card className={styles.accessDenied}>
          <h2 className={styles.accessTitle}>Access Denied</h2>
          <p className="text-muted-foreground">
            You need activist or admin privileges to access this page.
          </p>
        </Card>
      </div>
    )
  }

  const handleExport = async () => {
    try {
      const blob = await pollutionService.exportReport({ status: activeTab })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pollution-report-${activeTab}-${Date.now()}.csv`
      a.click()
      toast.success('Report exported successfully')
    } catch {
      toast.error('Failed to export report')
    }
  }

  const handleStatusChange = (id: string, status: PollutionStatus) => {
    updatePoint(
      { id, data: { status } },
      {
        onSuccess: () => toast.success('Status updated'),
        onError: () => toast.error('Failed to update status'),
      }
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PollutionStatus)}>
        <TabsList>
          <TabsTrigger value={PollutionStatus.REPORTED}>Reported</TabsTrigger>
          <TabsTrigger value={PollutionStatus.IN_PROGRESS}>In Progress</TabsTrigger>
          <TabsTrigger value={PollutionStatus.CLEANED}>Cleaned</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {points.length === 0 ? (
            <Card className={styles.emptyState}>
              <p className={styles.emptyText}>No points found</p>
            </Card>
          ) : (
            points.map((point) => (
              <PollutionCard
                key={point.id}
                point={point}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
