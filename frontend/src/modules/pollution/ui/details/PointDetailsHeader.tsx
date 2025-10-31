import Image from 'next/image'
import {Camera, Clock} from 'lucide-react'
import {Badge} from '@/shared/components/ui/Badge'
import {getMediaUrl} from '@/shared/utils/media'
import {Marker, PollutionStatus} from '../../domain/pollution.model'

const statusStyles: Record<PollutionStatus, string> = {
	[PollutionStatus.REPORTED]: 'bg-red-100 text-red-700 border-red-200',
	[PollutionStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
	[PollutionStatus.CLEANED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
	[PollutionStatus.VERIFIED]: 'bg-blue-100 text-blue-700 border-blue-200',
}

interface PointDetailsHeaderProps {
	marker: Marker
}

export const PointDetailsHeader = ({marker}: PointDetailsHeaderProps) => {
	const photos = marker.photos ?? []
	const featuredPhoto = photos[0]
	const featuredPhotoUrl = getMediaUrl(featuredPhoto?.image)

	return (
		<header className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
			<div className='space-y-3'>
				<div className='space-y-1'>
					<p className='text-sm uppercase tracking-wide text-muted-foreground'>Тип загрязнения</p>
					<h3 className='text-xl font-semibold capitalize'>{marker.pollution_type.name.replace(/_/g, ' ')}</h3>
				</div>
				{marker.status && (
					<Badge
						variant='outline'
						className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium ${statusStyles[marker.status]}`}
					>
						<Clock className='h-3 w-3' />
						{marker.status.replace(/_/g, ' ')}
					</Badge>
				)}
			</div>
			{featuredPhotoUrl ? (
				<div className='flex gap-2'>
					<div className='overflow-hidden rounded-lg border border-border bg-muted/40 p-1'>
						<Image
							src={featuredPhotoUrl}
							alt='Фото загрязнения'
							width={160}
							height={160}
							className='h-32 w-32 rounded-md object-cover'
							priority
						/>
					</div>
					{photos.length > 1 && (
						<div className='flex flex-col justify-between rounded-lg border border-dashed border-border/70 bg-muted/10 p-3 text-xs text-muted-foreground'>
							<span className='inline-flex items-center gap-2 font-medium'>
								<Camera className='h-3.5 w-3.5' />
								{photos.length} фото
							</span>
							<span>Откройте галерею для просмотра всех снимков</span>
						</div>
					)}
				</div>
			) : null}
		</header>
	)
}
