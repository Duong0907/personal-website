import { Button } from '@/components/ui/button';
import MenuIcon from '@material-design-icons/svg/outlined/menu.svg';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { NavBarItem } from '../navbar-item';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Logo } from '../logo';
import { useState } from 'react';
import { ABOUT_URL, BLOG_URL, PROJECTS_URL, ROOT_URL } from '@/lib/url';
import { useTranslations } from 'next-intl';

export function NavDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navbar');

  const closeDrawer = () => setIsOpen(false);

  const navConfig = [
    { title: t('home'), url: ROOT_URL },
    { title: t('projects'), url: PROJECTS_URL },
    { title: t('aboutMe'), url: ABOUT_URL },
    // { title: t('blog'), url: BLOG_URL },
  ];

  return (
    <Drawer direction="top" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon className="size-6 text-foreground" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-8">
        <DrawerHeader>
          <DrawerTitle>
            <Logo onClick={closeDrawer} />
          </DrawerTitle>
        </DrawerHeader>
        <NavigationMenu orientation="vertical" className="max-w-none">
          <NavigationMenuList aria-orientation="vertical" className="flex-col">
            {navConfig.map((config, index) => (
              <NavigationMenuItem onClick={closeDrawer} key={index}>
                <NavBarItem href={config.url} title={config.title}></NavBarItem>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </DrawerContent>
    </Drawer>
  );
}
