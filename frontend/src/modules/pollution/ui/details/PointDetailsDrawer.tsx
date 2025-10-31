import {UserRole} from '@/modules/auth'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/shared/components/ui/Sheet'
import {useTranslations} from 'next-intl'
import {Marker, PollutionStatus} from '../../domain/pollution.model'
import {PointDetails} from './PointDetails'

interface PointDetailsDrawerProps {
	marker: Marker | null
	userRole?: UserRole
	onClose: () => void
	onStatusChange: (status: PollutionStatus) => void
	onDelete: () => void
}

export const PointDetailsDrawer = ({
	marker,
	userRole,
	onClose,
	onStatusChange,
	onDelete,
}: PointDetailsDrawerProps) => {
	const t = useTranslations('home.details')

	return (
		<Sheet open={!!marker} onOpenChange={() => onClose()}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{t('drawerTitle')}</SheetTitle>
					<SheetDescription>{t('drawerDescription')}</SheetDescription>
				</SheetHeader>
				{marker && (
					<PointDetails
						marker={marker}
						userRole={userRole}
						onStatusChange={onStatusChange}
						onDelete={onDelete}
					/>
				)}
			</SheetContent>
		</Sheet>
	)
}
