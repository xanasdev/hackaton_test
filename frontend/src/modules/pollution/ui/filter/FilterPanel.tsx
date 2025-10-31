import {Filter as FilterIcon, X} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/shared/components/ui/Select'
import {Label} from '@/shared/components/ui/Label'
import {Button} from '@/shared/components/ui/Button'
import {Badge} from '@/shared/components/ui/Badge'
import styles from '@/shared/styles/filter.module.css'
import {PollutionStatus, PollutionType} from '../../domain/pollution.model'
import {useTranslations} from 'next-intl'

interface FilterPanelProps {
	status?: PollutionStatus
	type?: PollutionType | string
	onStatusChange: (status?: PollutionStatus) => void
	onTypeChange: (type?: PollutionType | string) => void
	onReset: () => void
}

export const FilterPanel = ({status, type, onStatusChange, onTypeChange, onReset}: FilterPanelProps) => {
	const hasActiveFilters = Boolean(status || type)
	const t = useTranslations()

	const statusLabels: Record<PollutionStatus, string> = {
		[PollutionStatus.REPORTED]: t('status.reported'),
		[PollutionStatus.IN_PROGRESS]: t('status.inProgress'),
		[PollutionStatus.CLEANED]: t('status.cleaned'),
		[PollutionStatus.VERIFIED]: t('status.verified'),
	}

	const typeLabels: Record<PollutionType, string> = {
		[PollutionType.TRASH]: t('pollutionType.trash'),
		[PollutionType.OIL_SPILL]: t('pollutionType.oil_spill'),
		[PollutionType.INDUSTRIAL_WASTE]: t('pollutionType.industrial_waste'),
		[PollutionType.SEWAGE]: t('pollutionType.sewage'),
		[PollutionType.PLASTIC]: t('pollutionType.plastic'),
		[PollutionType.OTHER]: t('pollutionType.other'),
	}

	const resolveTypeLabel = (value: PollutionType | string) => {
		const match = (Object.values(PollutionType) as string[]).find((item) => item === value)
		return match ? typeLabels[match as PollutionType] : value
	}

	return (
		<div className={styles.filterContainer}>
			{hasActiveFilters && (
				<div className={styles.activeFilters}>
					<div className='flex items-center gap-2 flex-wrap w-full'>
						<FilterIcon className='h-4 w-4' />
						<span className='text-sm font-semibold'>{t('filter.active')}</span>
						{status && (
							<Badge variant='default' className={styles.filterBadge}>
								{statusLabels[status] ?? status}
								<X className='h-3 w-3 cursor-pointer' onClick={() => onStatusChange(undefined)} />
							</Badge>
						)}
						{type && (
							<Badge variant='default' className={styles.filterBadge}>
								{resolveTypeLabel(type)}
								<X className='h-3 w-3 cursor-pointer' onClick={() => onTypeChange(undefined)} />
							</Badge>
						)}
					</div>
				</div>
			)}

			<div className={styles.filterSection}>
				<Label className={styles.filterLabel}>{t('filter.status')}</Label>
				<p className={styles.filterDescription}>{t('filter.statusDescription')}</p>
				<Select value={status ?? 'all'} onValueChange={(value) => onStatusChange(value === 'all' ? undefined : (value as PollutionStatus))}>
					<SelectTrigger>
						<SelectValue placeholder={t('filter.allStatuses')} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>{t('filter.allStatuses')}</SelectItem>
						<SelectItem value={PollutionStatus.REPORTED}>🔴 {t('status.reported')}</SelectItem>
						<SelectItem value={PollutionStatus.IN_PROGRESS}>🟡 {t('status.inProgress')}</SelectItem>
						<SelectItem value={PollutionStatus.CLEANED}>🟢 {t('status.cleaned')}</SelectItem>
						<SelectItem value={PollutionStatus.VERIFIED}>🔵 {t('status.verified')}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className={styles.filterSection}>
				<Label className={styles.filterLabel}>{t('filter.type')}</Label>
				<p className={styles.filterDescription}>{t('filter.typeDescription')}</p>
				<Select value={type ?? 'all'} onValueChange={(value) => onTypeChange(value === 'all' ? undefined : (value as PollutionType))}>
					<SelectTrigger>
						<SelectValue placeholder={t('filter.allTypes')} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>{t('filter.allTypes')}</SelectItem>
						<SelectItem value={PollutionType.TRASH}>🗑️ {t('pollutionType.TRASH')}</SelectItem>
						<SelectItem value={PollutionType.OIL_SPILL}>🛢️ {t('pollutionType.OIL_SPILL')}</SelectItem>
						<SelectItem value={PollutionType.INDUSTRIAL_WASTE}>🏭 {t('pollutionType.INDUSTRIAL_WASTE')}</SelectItem>
						<SelectItem value={PollutionType.SEWAGE}>💧 {t('pollutionType.SEWAGE')}</SelectItem>
						<SelectItem value={PollutionType.PLASTIC}>♻️ {t('pollutionType.PLASTIC')}</SelectItem>
						<SelectItem value={PollutionType.OTHER}>⚠️ {t('pollutionType.OTHER')}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{hasActiveFilters && (
				<div className={styles.filterActions}>
					<Button onClick={onReset} variant='outline' className={styles.resetButton}>
						{t('filter.reset')}
					</Button>
				</div>
			)}
		</div>
	)
}
