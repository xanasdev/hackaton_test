import {Button} from '@/shared/components/ui/Button'
import {Input} from '@/shared/components/ui/Input'
import {Label} from '@/shared/components/ui/Label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/Select'
import {Textarea} from '@/shared/components/ui/Textarea'
import styles from '@/shared/styles/form.module.css'
import {zodResolver} from '@hookform/resolvers/zod'
import {Upload} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {ChangeEvent, useState} from 'react'
import {useForm} from 'react-hook-form'
import {PollutionType} from '../../domain/pollution.model'
import {
	ReportPollutionFormData,
	reportPollutionSchema,
} from '../../schemas/report.schema'

interface ReportFormProps {
	latitude: number
	longitude: number
	onSubmit: (data: ReportPollutionFormData & {photos: File[]}) => void
	isLoading?: boolean
}

export const ReportForm = ({
	latitude,
	longitude,
	onSubmit,
	isLoading,
}: ReportFormProps) => {
	const [photos, setPhotos] = useState<File[]>([])
	const {
		register,
		handleSubmit,
		formState: {errors},
		setValue,
	} = useForm<ReportPollutionFormData>({
		resolver: zodResolver(reportPollutionSchema),
	})
	const t = useTranslations('report')
	const tType = useTranslations('pollutionType')

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return
		setPhotos(Array.from(event.target.files))
	}

	const handleFormSubmit = (data: ReportPollutionFormData) => {
		onSubmit({...data, photos})
	}

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
			<div className={styles.formGroup}>
				<Label>{t('location')}</Label>
				<p className={styles.mutedText}>
					{t('lat')}: {latitude.toFixed(6)}, {t('lng')}: {longitude.toFixed(6)}
				</p>
			</div>

			<div className={styles.formGroup}>
				<Label htmlFor='type'>{t('type')}</Label>
				<Select
					onValueChange={(value) => setValue('type', value as PollutionType)}
				>
					<SelectTrigger>
						<SelectValue placeholder={t('typePlaceholder')} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={PollutionType.TRASH}>
							{tType('trash')}
						</SelectItem>
						<SelectItem value={PollutionType.OIL_SPILL}>
							{tType('oil_spill')}
						</SelectItem>
						<SelectItem value={PollutionType.INDUSTRIAL_WASTE}>
							{tType('industrial_waste')}
						</SelectItem>
						<SelectItem value={PollutionType.SEWAGE}>
							{tType('sewage')}
						</SelectItem>
						<SelectItem value={PollutionType.PLASTIC}>
							{tType('plastic')}
						</SelectItem>
						<SelectItem value={PollutionType.OTHER}>
							{tType('other')}
						</SelectItem>
					</SelectContent>
				</Select>
				{errors.type && (
					<p className={styles.errorText}>{errors.type.message}</p>
				)}
			</div>

			<div className={styles.formGroup}>
				<Label htmlFor='description'>{t('description')}</Label>
				<Textarea
					{...register('description')}
					placeholder={t('descriptionPlaceholder')}
				/>
				{errors.description && (
					<p className={styles.errorText}>{errors.description.message}</p>
				)}
			</div>

			<div className={styles.formGroup}>
				<Label htmlFor='region'>{t('region')}</Label>
				<Input {...register('region')} placeholder={t('regionPlaceholder')} />
			</div>

			<div className={styles.formGroup}>
				<Label htmlFor='photos'>{t('photos')}</Label>
				<div className={styles.fileInput}>
					<Input
						id='photos'
						type='file'
						multiple
						accept='image/*'
						onChange={handleFileChange}
					/>
					<Upload className='h-4 w-4' />
				</div>
				{photos.length > 0 && (
					<p className={styles.mutedText}>
						{t('photosSelected', {count: photos.length})}
					</p>
				)}
			</div>

			<Button type='submit' disabled={isLoading} className='w-full'>
				{isLoading ? t('submitting') : t('submit')}
			</Button>
		</form>
	)
}
