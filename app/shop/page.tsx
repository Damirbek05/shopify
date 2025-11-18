import { storeCatalog } from '@/lib/shopify/constants';
import ProductList from './components/product-list';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ResultsControls from './components/results-controls';
import { ProductGrid } from './components/product-grid';
import { ProductCardSkeleton } from './components/product-card-skeleton';

export const metadata: Metadata = {
  title: 'ACME Store | Shop',
  description: 'ACME Store, your one-stop shop for all your needs.',
};

// Force static generation for GitHub Pages
export const dynamic = 'force-static';

// Note: revalidate is not supported in static export mode (GitHub Pages)
// All pages are generated at build time
// export const revalidate = 60;

export default async function Shop() {
  return (
    <>
      <Suspense
        fallback={
          <>
            <ResultsControls className="max-md:hidden" collections={[]} products={[]} />
            <ProductGrid>
              {Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </ProductGrid>
          </>
        }
      >
        <ProductList collection={storeCatalog.rootCategoryId} />
      </Suspense>
    </>
  );
}
