import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/shared/components/ui/Sheet'
import {PollutionStatus, PollutionType} from '../../domain/pollution.model'
import {FilterPanel} from './FilterPanel'

interface FilterDrawerProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	status?: PollutionStatus
	type?: PollutionType | string
	onStatusChange: (status?: PollutionStatus) => void
	onTypeChange: (type?: PollutionType | string) => void
	onReset: () => void
}

export const FilterDrawer = ({
	open,
	onOpenChange,
	status,
	type,
	onStatusChange,
	onTypeChange,
	onReset,
}: FilterDrawerProps) => (
	<Sheet open={open} onOpenChange={onOpenChange}>
		<SheetContent>
			<SheetHeader>
				<SheetTitle>Filter Points</SheetTitle>
			</SheetHeader>
			<FilterPanel status={status} type={type as PollutionType | undefined} onStatusChange={onStatusChange} onTypeChange={onTypeChange} onReset={onReset} />
		</SheetContent>
	</Sheet>
)
