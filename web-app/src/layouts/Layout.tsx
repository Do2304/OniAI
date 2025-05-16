import {
  SidebarProvider,
  Sidebar,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarHeaderLayout from './SidebarHeaderLayout';
import SidebarContentLayout from './SidebarContentLayout';
import SidebarFooterLayout from './SidebarFooterLayout';
import { useTheme } from '@/components/theme-provider';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const { setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState('light');

  const toggleTheme = () => {
    const newTheme = darkMode === 'light' ? 'dark' : 'light';
    setDarkMode(newTheme);
    setTheme(newTheme);
  };
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeaderLayout />
        <SidebarContentLayout />
        <SidebarFooterLayout />
        <SidebarRail />
      </Sidebar>
      <main className="w-full">
        <SidebarTrigger className="ml-1 mt-4 " />
        <button
          className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground py-2 group/toggle h-8 w-8 px-0"
          onClick={toggleTheme}
        >
          {darkMode === 'light' ? <FaMoon /> : <FaSun />}{' '}
        </button>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
