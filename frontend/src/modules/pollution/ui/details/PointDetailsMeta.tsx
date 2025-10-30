import {CalendarDays, Clock, MapPin, User as UserIcon} from 'lucide-react'
import {format} from 'date-fns'
import {Avatar, AvatarFallback, AvatarImage} from '@/shared/components/ui/Avatar'
import {Marker} from '../../domain/pollution.model'

interface PointDetailsMetaProps {
	marker: Marker
}

export const PointDetailsMeta = ({marker}: PointDetailsMetaProps) => (
	<section className='grid gap-4 rounded-lg border border-dashed border-border/60 bg-background/60 p-4 sm:grid-cols-2'>
		<div className='flex items-start gap-3'>
			<UserIcon className='mt-1 h-4 w-4 text-primary' />
			<div className='space-y-1 text-sm'>
				<p className='font-medium'>Сообщил</p>
				<div className='flex items-center gap-2 text-muted-foreground'>
					<Avatar className='h-7 w-7'>
						<AvatarImage src={marker.reported_by?.avatar ?? undefined} />
						<AvatarFallback>{marker.reported_by?.name?.[0] ?? '?'}</AvatarFallback>
					</Avatar>
					<span>{marker.reported_by?.name ?? 'Неизвестно'}</span>
				</div>
			</div>
		</div>
		<div className='flex items-start gap-3'>
			<CalendarDays className='mt-1 h-4 w-4 text-primary' />
			<div className='space-y-1 text-sm'>
				<p className='font-medium'>Дата создания</p>
				<p className='text-muted-foreground'>
					{format(new Date(marker.created_at), 'dd MMM yyyy, HH:mm')}
				</p>
			</div>
		</div>
		<div className='flex items-start gap-3'>
			<MapPin className='mt-1 h-4 w-4 text-primary' />
			<div className='space-y-1 text-sm'>
				<p className='font-medium'>Регион</p>
				<p className='text-muted-foreground'>{marker.region_type ?? 'Не указан'}</p>
			</div>
		</div>
		<div className='flex items-start gap-3'>
			<Clock className='mt-1 h-4 w-4 text-primary' />
			<div className='space-y-1 text-sm'>
				<p className='font-medium'>Координаты</p>
				<p className='text-muted-foreground'>
					{Number(marker.latitude).toFixed(4)}, {Number(marker.longitude).toFixed(4)}
				</p>
			</div>
		</div>
	</section>
)
