'use client';

import { useEffect, useMemo } from 'react';
import { Product, Collection } from '@/lib/shopify/types';
import { ProductCard } from './product-card';
import ResultsControls from './results-controls';
import { useProducts } from '../providers/products-provider';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { ProductGrid } from './product-grid';
import { Card } from '../../../components/ui/card';

interface ProductListContentProps {
  products: Product[];
  collections: Collection[];
}

// Client-side search function
function searchProducts(products: Product[], query: string): Product[] {
  if (!query || query.trim() === '') {
    return products;
  }

  const searchTerm = query.toLowerCase().trim();
  return products.filter(product => {
    const title = product.title?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    const handle = product.handle?.toLowerCase() || '';
    
    return title.includes(searchTerm) || 
           description.includes(searchTerm) || 
           handle.includes(searchTerm);
  });
}

// Client-side sorting function
function sortProducts(products: Product[], sortKey: string | null): Product[] {
  if (!sortKey) {
    return products;
  }

  const sorted = [...products];

  switch (sortKey) {
    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return priceA - priceB;
      });
    
    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return priceB - priceA;
      });
    
    case 'newest':
      // Note: We don't have created date in Product type, so we'll sort by title as fallback
      return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    
    case 'oldest':
      // Note: We don't have created date in Product type, so we'll sort by title as fallback
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    
    default:
      return products;
  }
}

// Client-side color filtering function
function filterProductsByColors(products: Product[], colors: string[]): Product[] {
  if (!colors || colors.length === 0) {
    return products;
  }

  const filteredProducts = products.filter(product => {
    // Check if product has any variants with the selected colors
    // Note: variants is now a simple array after adaptShopifyProduct transformation
    const hasMatchingColor = product.variants?.some((variant: any) => {
      if (!variant.selectedOptions) return false;

      // Look for color option in variant
      return variant.selectedOptions.some((option: any) => {
        const isColorOption =
          option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');

        if (!isColorOption) return false;

        // Check if this variant's color matches any of the selected colors
        const variantColor = option.value.toLowerCase();
        return colors.some(
          selectedColor =>
            selectedColor.toLowerCase() === variantColor ||
            variantColor.includes(selectedColor.toLowerCase()) ||
            selectedColor.toLowerCase().includes(variantColor)
        );
      });
    });

    // Also check product-level options as fallback
    if (!hasMatchingColor && product.options) {
      const colorOption = product.options.find(
        (opt: any) => opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
      );

      if (colorOption && colorOption.values) {
        return colorOption.values.some((value: any) => {
          // Handle both string values and object values with .name property
          const colorValue = typeof value === 'string' ? value : value.name || value.id;
          const optionColor = colorValue.toLowerCase();
          return colors.some(
            selectedColor =>
              selectedColor.toLowerCase() === optionColor ||
              optionColor.includes(selectedColor.toLowerCase()) ||
              selectedColor.toLowerCase().includes(optionColor)
          );
        });
      }
    }

    return hasMatchingColor;
  });

  return filteredProducts;
}

export function ProductListContent({ products, collections }: ProductListContentProps) {
  const { setProducts, setOriginalProducts } = useProducts();

  // Get current filters and search params from URL
  const [colorFilters] = useQueryState('fcolor', parseAsArrayOf(parseAsString).withDefault([]));
  const [searchQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [sortKey] = useQueryState('sort', parseAsString.withDefault(null));

  // Apply client-side filtering, searching, and sorting
  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply search
    result = searchProducts(result, searchQuery);

    // Apply color filters
    result = filterProductsByColors(result, colorFilters);

    // Apply sorting
    result = sortProducts(result, sortKey);

    return result;
  }, [products, colorFilters, searchQuery, sortKey]);

  // Set both original and filtered products in the provider whenever they change
  useEffect(() => {
    setOriginalProducts(products);
    setProducts(filteredProducts);
  }, [products, filteredProducts, setProducts, setOriginalProducts]);

  return (
    <>
      <ResultsControls className="max-md:hidden" collections={collections} products={filteredProducts} />

      {filteredProducts.length > 0 ? (
        <ProductGrid>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      ) : (
        <Card className="flex mr-sides flex-1 items-center justify-center">
          <p className="text text-muted-foreground font-medium">No products found</p>
        </Card>
      )}
    </>
  );
}
