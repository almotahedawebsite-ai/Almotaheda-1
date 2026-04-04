import { notFound } from 'next/navigation';

// Store module has been removed from Al-Motaheda
export default function StoreDashboardGuard({ children }: { children: React.ReactNode }) {
  notFound();
}
