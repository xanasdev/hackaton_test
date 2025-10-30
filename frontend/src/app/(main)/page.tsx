'use client'

import { useAuth } from '@/shared/hooks/use-auth'
import { usePollution } from '@/shared/hooks/use-pollution'
import { useMapState } from './hooks/useMapState'
import { useMapActions } from './hooks/useMapActions'
import { MapWrapper } from '@/shared/components/map/MapWrapper'
import { YandexMapView } from '@/shared/components/map/YandexMapView'
import { MapMarkersList } from '@/shared/components/map/MapMarkersList'
import { StatsOverlay } from '@/shared/components/stats/StatsOverlay'
import { MapActionButtons } from '@/shared/components/actions/MapActionButtons'
import { ReportPollutionDialog } from '@/shared/components/dialogs/ReportPollutionDialog'
import { PointDetailsDrawer } from '@/shared/components/sheets/PointDetailsDrawer'
import { FilterDrawer } from '@/shared/components/sheets/FilterDrawer'

export default function HomePage() {
  const { user } = useAuth()
  
  const {
    selectedPoint,
    setSelectedPoint,
    reportDialogOpen,
    setReportDialogOpen,
    filterOpen,
    setFilterOpen,
    newPointCoords,
    setNewPointCoords,
    filters,
    setFilters,
  } = useMapState()

  const { points, stats, createPoint, updatePoint, deletePoint, isCreating } = usePollution(filters)

  const { handleMapClick, handleReportSubmit, handleStatusChange, handleDelete } = useMapActions({
    setNewPointCoords,
    setReportDialogOpen,
    setSelectedPoint,
    createPoint,
    updatePoint,
    deletePoint,
    selectedPoint,
  })

  return (
    <MapWrapper>
      <YandexMapView onMapClick={handleMapClick}>
        <MapMarkersList points={points} onMarkerClick={setSelectedPoint} />
      </YandexMapView>

      <StatsOverlay stats={stats} />
      
      <MapActionButtons
        onFilterClick={() => setFilterOpen(true)}
        onReportClick={() => setReportDialogOpen(true)}
      />

      <ReportPollutionDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        coords={newPointCoords}
        onSubmit={(data) => handleReportSubmit(newPointCoords, data)}
        isLoading={isCreating}
      />

      <PointDetailsDrawer
        point={selectedPoint}
        userRole={user?.role}
        onClose={() => setSelectedPoint(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        status={filters.status}
        type={filters.type}
        onStatusChange={(status) => setFilters((f) => ({ ...f, status }))}
        onTypeChange={(type) => setFilters((f) => ({ ...f, type }))}
        onReset={() => setFilters({})}
      />
    </MapWrapper>
  )
}
