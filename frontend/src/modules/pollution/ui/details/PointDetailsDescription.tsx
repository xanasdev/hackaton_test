interface PointDetailsDescriptionProps {
	description: string
}

export const PointDetailsDescription = ({description}: PointDetailsDescriptionProps) => (
	<section className='space-y-3 rounded-lg border border-border bg-muted/30 p-4'>
		<h4 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>Описание</h4>
		<p className='text-sm leading-relaxed text-foreground'>{description}</p>
	</section>
)
