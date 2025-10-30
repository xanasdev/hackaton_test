import {MapPin} from 'lucide-react'
import {ReportForm} from '../forms/ReportForm'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/shared/components/ui/Dialog'
import {DEFAULT_MAP_CENTER} from '@/shared/constants/map.constants'
import {PollutionType} from '../../domain/pollution.model'

interface ReportPollutionDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	coords: [number, number] | null
	onSubmit: (data: {
		type: PollutionType
		description: string
		photos: File[]
		region?: string
	}) => void
	isLoading: boolean
}

export const ReportPollutionDialog = ({
	open,
	onOpenChange,
	coords,
	onSubmit,
	isLoading,
}: ReportPollutionDialogProps) => {
	const reportCoords = coords ?? DEFAULT_MAP_CENTER

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Report Pollution</DialogTitle>
				</DialogHeader>
				{!coords && (
					<div className='flex items-center gap-2 rounded-lg bg-muted px-3 py-2 mb-4'>
						<MapPin className='h-4 w-4 text-blue-500' />
						<p className='text-sm text-muted-foreground'>Using default location. Click on the map to select a specific location.</p>
					</div>
				)}
				<ReportForm
					latitude={reportCoords[0]}
					longitude={reportCoords[1]}
					onSubmit={onSubmit}
					isLoading={isLoading}
				/>
			</DialogContent>
		</Dialog>
	)
}
