'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface TenantData {
  id: string;
  name: string;
  domain: string;
  settings: any;
}

interface TenantContextType {
  tenant: TenantData | null;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children, tenant }: { children: ReactNode; tenant: TenantData | null }) => {
  return (
    <TenantContext.Provider value={{ tenant, isLoading: false }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
