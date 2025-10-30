import { PollutionStatus, PollutionType } from '@/shared/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/Select'
import { Label } from '@/shared/components/ui/Label'
import { Button } from '@/shared/components/ui/Button'
import { X } from 'lucide-react'

interface FilterPanelProps {
  status?: PollutionStatus
  type?: PollutionType
  onStatusChange: (status?: PollutionStatus) => void
  onTypeChange: (type?: PollutionType) => void
  onReset: () => void
}

export function FilterPanel({
  status,
  type,
  onStatusChange,
  onTypeChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={(v) => onStatusChange(v as PollutionStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={PollutionStatus.REPORTED}>Reported</SelectItem>
            <SelectItem value={PollutionStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={PollutionStatus.CLEANED}>Cleaned</SelectItem>
            <SelectItem value={PollutionStatus.VERIFIED}>Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => onTypeChange(v as PollutionType)}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={PollutionType.TRASH}>Trash</SelectItem>
            <SelectItem value={PollutionType.OIL_SPILL}>Oil Spill</SelectItem>
            <SelectItem value={PollutionType.INDUSTRIAL_WASTE}>Industrial Waste</SelectItem>
            <SelectItem value={PollutionType.SEWAGE}>Sewage</SelectItem>
            <SelectItem value={PollutionType.PLASTIC}>Plastic</SelectItem>
            <SelectItem value={PollutionType.OTHER}>Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
