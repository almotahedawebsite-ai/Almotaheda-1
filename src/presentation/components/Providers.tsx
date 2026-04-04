'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

export function Providers({ 
  children, 
  enableDarkMode 
}: { 
  children: React.ReactNode, 
  enableDarkMode: boolean 
}) {
  if (!enableDarkMode) {
    return children;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
