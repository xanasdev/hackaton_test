import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/shared/components/ui/Sheet'
import {Marker, PollutionStatus} from '../../domain/pollution.model'
import {UserRole} from '@/modules/auth'
import {PointDetails} from './PointDetails'

interface PointDetailsDrawerProps {
	marker: Marker | null
	userRole?: UserRole
	onClose: () => void
	onStatusChange: (status: PollutionStatus) => void
	onDelete: () => void
}

export const PointDetailsDrawer = ({marker, userRole, onClose, onStatusChange, onDelete}: PointDetailsDrawerProps) => (
	<Sheet open={!!marker} onOpenChange={() => onClose()}>
		<SheetContent>
			<SheetHeader>
				<SheetTitle>Pollution Details</SheetTitle>
			</SheetHeader>
			{marker && (
				<PointDetails marker={marker} userRole={userRole} onStatusChange={onStatusChange} onDelete={onDelete} />
			)}
		</SheetContent>
	</Sheet>
)
