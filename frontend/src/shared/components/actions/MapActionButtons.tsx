import { Button } from '@/shared/components/ui/Button'
import { Plus, Filter } from 'lucide-react'

interface MapActionButtonsProps {
  onFilterClick: () => void
  onReportClick: () => void
}

export function MapActionButtons({ onFilterClick, onReportClick }: MapActionButtonsProps) {
  return (
    <div style={{ 
      position: 'absolute', 
      bottom: '1rem', 
      right: '1rem', 
      zIndex: 1000, 
      display: 'flex', 
      gap: '0.5rem' 
    }}>
      <Button onClick={onFilterClick}>
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
      <Button onClick={onReportClick}>
        <Plus className="h-4 w-4 mr-2" />
        Report
      </Button>
    </div>
  )
}
