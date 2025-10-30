import Image from 'next/image'
import {format} from 'date-fns'
import {Card} from '@/shared/components/ui/Card'
import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import {Avatar, AvatarFallback, AvatarImage} from '@/shared/components/ui/Avatar'
import {Marker, PollutionStatus} from '../../domain/pollution.model'
import {UserRole} from '@/modules/auth'

interface PointDetailsProps {
	marker: Marker
	userRole?: UserRole
	onStatusChange?: (status: PollutionStatus) => void
	onDelete?: () => void
}

const statusColors: Record<PollutionStatus, string> = {
	[PollutionStatus.REPORTED]: 'bg-red-500',
	[PollutionStatus.IN_PROGRESS]: 'bg-yellow-500',
	[PollutionStatus.CLEANED]: 'bg-green-500',
	[PollutionStatus.VERIFIED]: 'bg-blue-500',
}

export const PointDetails = ({marker, userRole, onStatusChange, onDelete}: PointDetailsProps) => {
	const canManage =
		userRole === UserRole.ACTIVIST || userRole === UserRole.ADMIN

	return (
		<Card className='space-y-4 p-4'>
			<div className='flex items-start justify-between'>
				<div>
					<h3 className='text-lg font-semibold'>{marker.pollution_type.name.replace(/_/g, ' ')}</h3>
					{marker.status && <Badge className={statusColors[marker.status]}>{marker.status}</Badge>}
				</div>
				{marker.photos?.length ? (
					<Image
						src={marker.photos[0].image_path}
						alt='Pollution'
						width={80}
						height={80}
						className='h-20 w-20 rounded object-cover'
					/>
				) : null}
			</div>

			<p className='text-sm text-muted-foreground'>{marker.description}</p>

			<div className='flex items-center gap-2'>
				<Avatar className='h-8 w-8'>
					<AvatarImage src={marker.reported_by?.avatar ?? undefined} />
					<AvatarFallback>{marker.reported_by?.name?.[0] ?? '?'}</AvatarFallback>
				</Avatar>
				<div className='text-sm'>
					<p className='font-medium'>{marker.reported_by?.name ?? 'Unknown reporter'}</p>
					<p className='text-muted-foreground'>
						{format(new Date(marker.created_at), 'MMM d, yyyy')}
					</p>
				</div>
			</div>

			{marker.region_type && (
				<p className='text-sm'>
					<span className='font-medium'>Region:</span> {marker.region_type}
				</p>
			)}

			{canManage && (
				<div className='flex gap-2 border-t pt-2'>
					{marker.status !== PollutionStatus.IN_PROGRESS && onStatusChange && (
						<Button size='sm' variant='outline' onClick={() => onStatusChange(PollutionStatus.IN_PROGRESS)}>
							Mark In Progress
						</Button>
					)}
					{marker.status !== PollutionStatus.CLEANED && onStatusChange && (
						<Button size='sm' variant='outline' onClick={() => onStatusChange(PollutionStatus.CLEANED)}>
							Mark Cleaned
						</Button>
					)}
					{userRole === UserRole.ADMIN && onDelete && (
						<Button size='sm' variant='destructive' onClick={onDelete}>
							Delete
						</Button>
					)}
				</div>
			)}
		</Card>
	)
}
