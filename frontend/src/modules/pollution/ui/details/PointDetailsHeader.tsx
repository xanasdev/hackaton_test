import Image from 'next/image'
import {Clock} from 'lucide-react'
import {Badge} from '@/shared/components/ui/Badge'
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

export const PointDetailsHeader = ({marker}: PointDetailsHeaderProps) => (
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
		{marker.photos?.length ? (
			<div className='overflow-hidden rounded-lg border border-border bg-muted/40 p-1'>
				<Image
					src={marker.photos[0].image_path}
					alt='Фото загрязнения'
					width={140}
					height={140}
					className='h-32 w-32 rounded-md object-cover'
					priority
				/>
			</div>
		) : null}
	</header>
)
