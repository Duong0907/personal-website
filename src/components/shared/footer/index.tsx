import { Typography } from '@/components/ui/typography';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center my-8">
      <div className="divider border-t-foreground border-t w-full max-w-138.75 mb-12"></div>
      <Typography variant="body" weight="regular">
        Phan Thanh Duong @ {currentYear}
      </Typography>
    </div>
  );
}
