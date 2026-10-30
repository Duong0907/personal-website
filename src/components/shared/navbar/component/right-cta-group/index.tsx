'use client';

import { LanguageSwitch } from '../language-switch';
import { NavDialog } from '../nav-dialog';
import { ThemeSwitch } from '../theme-switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import duongImage from '@/assets/duong.webp';

export function RightCTAGroup() {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="h-8 flex items-center gap-2">
        <ThemeSwitch />
        <LanguageSwitch />
      </div>

      <div className="md:hidden">
        <NavDialog />
      </div>

      <Avatar className="hidden md:block bg-white">
        <AvatarImage src={duongImage.src} alt="Avatar" />
        <AvatarFallback>Duong Phan</AvatarFallback>
      </Avatar>
    </div>
  );
}
