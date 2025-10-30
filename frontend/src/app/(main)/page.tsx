'use client'

import { useState } from 'react'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import { useAuth } from '@/shared/hooks/use-auth'
import { usePollution } from '@/shared/hooks/use-pollution'
import { PollutionPoint, PollutionStatus, PollutionType } from '@/shared/types'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/Dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/Sheet'
import { ReportForm } from '@/shared/components/pollution/ReportForm'
import { PointDetails } from '@/shared/components/pollution/PointDetails'
import { FilterPanel } from '@/shared/components/pollution/FilterPanel'
import { Plus, Filter } from 'lucide-react'
import { toast } from 'sonner'

export default function HomePage() {
  const [selectedPoint, setSelectedPoint] = useState<PollutionPoint | null>(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [newPointCoords, setNewPointCoords] = useState<[number, number] | null>(null)
  const [filters, setFilters] = useState<{ status?: PollutionStatus; type?: PollutionType }>({})

  const { user } = useAuth()
  const { points, stats, createPoint, updatePoint, deletePoint, isCreating } = usePollution(filters)

  const handleMapClick = (e: any) => {
    const coords = e.get('coords') as [number, number]
    setNewPointCoords(coords)
    setReportDialogOpen(true)
  }

  const handleReportSubmit = (data: { type: PollutionType; description: string; photos: File[]; region?: string }) => {
    if (!newPointCoords) return
    createPoint(
      {
        latitude: newPointCoords[0],
        longitude: newPointCoords[1],
        type: data.type,
        description: data.description,
        photos: data.photos,
        region: data.region,
      },
      {
        onSuccess: () => {
          toast.success('Pollution point reported successfully')
          setReportDialogOpen(false)
          setNewPointCoords(null)
        },
        onError: () => toast.error('Failed to report pollution point'),
      }
    )
  }

  const handleStatusChange = (status: PollutionStatus) => {
    if (!selectedPoint) return
    updatePoint(
      { id: selectedPoint.id, data: { status } },
      {
        onSuccess: () => {
          toast.success('Status updated successfully')
          setSelectedPoint(null)
        },
        onError: () => toast.error('Failed to update status'),
      }
    )
  }

  const handleDelete = () => {
    if (!selectedPoint) return
    deletePoint(selectedPoint.id, {
      onSuccess: () => {
        toast.success('Point deleted successfully')
        setSelectedPoint(null)
      },
      onError: () => toast.error('Failed to delete point'),
    })
  }

  const getMarkerColor = (status: PollutionStatus): string => {
    switch (status) {
      case PollutionStatus.REPORTED: return '#ef4444'
      case PollutionStatus.IN_PROGRESS: return '#f59e0b'
      case PollutionStatus.CLEANED: return '#10b981'
      case PollutionStatus.VERIFIED: return '#3b82f6'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 4rem)', position: 'relative' }}>
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY }}>
        <Map
          defaultState={{ center: [42.8746, 47.6248], zoom: 10 }}
          width="100%"
          height="100%"
          onClick={handleMapClick}
        >
          {points.map((point) => (
            <Placemark
              key={point.id}
              geometry={[point.latitude, point.longitude]}
              options={{
                preset: 'islands#circleIcon',
                iconColor: getMarkerColor(point.status),
              }}
              onClick={() => setSelectedPoint(point)}
            />
          ))}
        </Map>
      </YMaps>

      <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', zIndex: 1000, pointerEvents: 'none' }}>
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', pointerEvents: 'auto' }}>
            <Card style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</p>
            </Card>
            <Card style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Reported</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.reported}</p>
            </Card>
            <Card style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>In Progress</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.inProgress}</p>
            </Card>
            <Card style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cleaned</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.cleaned}</p>
            </Card>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 1000, display: 'flex', gap: '0.5rem' }}>
        <Button onClick={() => setFilterOpen(true)}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button onClick={() => setReportDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Report
        </Button>
      </div>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Pollution</DialogTitle>
          </DialogHeader>
          {newPointCoords && (
            <ReportForm
              latitude={newPointCoords[0]}
              longitude={newPointCoords[1]}
              onSubmit={handleReportSubmit}
              isLoading={isCreating}
            />
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={!!selectedPoint} onOpenChange={() => setSelectedPoint(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Pollution Details</SheetTitle>
          </SheetHeader>
          {selectedPoint && (
            <PointDetails
              point={selectedPoint}
              userRole={user?.role}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Points</SheetTitle>
          </SheetHeader>
          <FilterPanel
            status={filters.status}
            type={filters.type}
            onStatusChange={(status) => setFilters((f) => ({ ...f, status }))}
            onTypeChange={(type) => setFilters((f) => ({ ...f, type }))}
            onReset={() => setFilters({})}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
