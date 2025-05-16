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
        <button onClick={toggleTheme}>
          {darkMode === 'light' ? <FaMoon /> : <FaSun />}{' '}
        </button>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
