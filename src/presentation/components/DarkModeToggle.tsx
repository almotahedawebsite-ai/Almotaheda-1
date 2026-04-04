'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />; // Prevent hydration mismatch

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors group"
      title="تبديل الوضع الليلي والنهاري"
    >
      {theme === 'dark' ? <FiSun className="group-hover:rotate-45 transition-transform duration-500" /> : <FiMoon className="group-hover:-rotate-12 transition-transform duration-500" />}
    </button>
  );
}
