import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PageBlock } from '@/types/schema/production_schema';

/**
 * 4. ROBUST BLOCK RENDERING ENGINE
 * 
 * Features:
 * - Lazy loading for all blocks
 * - Skeleton loading states per block
 * - Versioned block rendering
 * - Error isolation (Error Boundary)
 */

const BLOCK_REGISTRY: Record<string, any> = {
  hero: dynamic(() => import('./HeroBlock'), { loading: () => <BlockSkeleton /> }),
  gallery: dynamic(() => import('./GalleryBlock'), { loading: () => <BlockSkeleton height="300px" /> }),
  cta: dynamic(() => import('./CTABlock'), { loading: () => <BlockSkeleton height="150px" /> }),
  // faq: dynamic(() => import('./FAQBlock'), { loading: () => <BlockSkeleton /> }),
  // product_grid: dynamic(() => import('./ProductGridBlock'), { loading: () => <BlockSkeleton height="400px" /> }),
};

export const BlockFactory: React.FC<{ blocks: PageBlock[] }> = ({ blocks }) => {
  return (
    <div className="w-full flex flex-col overflow-hidden">
      {blocks
        .sort((a, b) => a.order - b.order)
        .map((block) => (
          <ErrorBoundary key={block.id} blockType={block.type}>
            <Suspense fallback={<BlockSkeleton />}>
              <BlockItem block={block} />
            </Suspense>
          </ErrorBoundary>
        ))}
    </div>
  );
};

const BlockItem = ({ block }: { block: PageBlock }) => {
  const Component = BLOCK_REGISTRY[block.type];
  if (!Component) return <div className="p-10 bg-red-50 text-red-500">Missing Block: {block.type}</div>;
  
  // Pass block data and support for versioning
  return <Component data={block.data} version={block.data.version || 1} />;
};

const BlockSkeleton = ({ height = '200px' }: { height?: string }) => (
  <div style={{ height }} className="w-full animate-pulse bg-gray-100 mb-4 rounded-md" />
);

class ErrorBoundary extends React.Component<{ children: React.ReactNode, blockType: string }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-4 bg-orange-50 text-orange-600">Failed to render block: {this.props.blockType}</div>;
    return this.props.children;
  }
}
