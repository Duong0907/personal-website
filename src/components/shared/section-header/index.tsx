import { Typography } from '@/components/ui/typography';

export function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <Typography variant="h1" weight="regular" className="text-center mb-2">
        {title}
      </Typography>

      <Typography variant="body" weight="light" className="text-xl text-center mb-16">
        {description}
      </Typography>
    </div>
  );
}
