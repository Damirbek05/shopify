import { getCollectionProducts, getCollections, getProducts } from '@/lib/shopify';
import type { Product } from '@/lib/shopify/types';
import { ProductListContent } from './product-list-content';

interface ProductListProps {
  collection: string;
}

export default async function ProductList({ collection }: ProductListProps) {
  const isRootCollection = collection === 'joyco-root' || !collection;

  let products: Product[] = [];

  try {
    // For static export, load all products without server-side filtering
    // Filtering, sorting, and search will be handled on the client side
    if (isRootCollection) {
      products = await getProducts({
        limit: 250, // Load more products for client-side filtering
      });
    } else {
      products = await getCollectionProducts({
        collection,
        limit: 250, // Load more products for client-side filtering
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  const collections = await getCollections();

  return <ProductListContent products={products} collections={collections} />;
}
