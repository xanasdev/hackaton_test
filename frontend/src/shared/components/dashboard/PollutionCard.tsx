import { PollutionPoint, PollutionStatus } from '@/shared/types'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { MapPin } from 'lucide-react'
import styles from '@/shared/styles/dashboard.module.css'

interface PollutionCardProps {
  point: PollutionPoint
  onStatusChange: (id: string, status: PollutionStatus) => void
}

export function PollutionCard({ point, onStatusChange }: PollutionCardProps) {
  return (
    <Card className={styles.pointCard}>
      <div className={styles.pointHeader}>
        <div className={styles.pointContent}>
          <div className={styles.badgeGroup}>
            <Badge>{point.type}</Badge>
            <Badge variant="outline">{point.status}</Badge>
          </div>
          <p className={styles.pointDescription}>{point.description}</p>
          <div className={styles.pointMeta}>
            <MapPin className="h-4 w-4" />
            <span>
              {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
            </span>
            {point.region && <span>• {point.region}</span>}
          </div>
        </div>
        <div className={styles.actions}>
          {point.status === PollutionStatus.REPORTED && (
            <Button
              size="sm"
              onClick={() => onStatusChange(point.id, PollutionStatus.IN_PROGRESS)}
            >
              Start Work
            </Button>
          )}
          {point.status === PollutionStatus.IN_PROGRESS && (
            <Button
              size="sm"
              onClick={() => onStatusChange(point.id, PollutionStatus.CLEANED)}
            >
              Mark Cleaned
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
