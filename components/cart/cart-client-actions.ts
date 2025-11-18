'use client';

import type { Cart, CartItem, ShopifyCart, ShopifyCartLine } from '@/lib/shopify/types';
import {
  createCart as createShopifyCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  getCart as getShopifyCart,
} from '@/lib/shopify/shopify';

// Client-side cookie utilities
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 30) {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

// Local adapter utilities to return FE Cart
function adaptCartLine(shopifyLine: ShopifyCartLine): CartItem {
  const merchandise = shopifyLine.merchandise;
  const product = merchandise.product;

  return {
    id: shopifyLine.id,
    quantity: shopifyLine.quantity,
    cost: {
      totalAmount: {
        amount: (parseFloat(merchandise.price.amount) * shopifyLine.quantity).toString(),
        currencyCode: merchandise.price.currencyCode,
      },
    },
    merchandise: {
      id: merchandise.id,
      title: merchandise.title,
      selectedOptions: merchandise.selectedOptions || [],
      product: {
        id: product.title,
        title: product.title,
        handle: product.handle,
        categoryId: undefined,
        description: '',
        descriptionHtml: '',
        featuredImage: product.images?.edges?.[0]?.node
          ? {
              ...product.images.edges[0].node,
              altText: product.images.edges[0].node.altText || product.title,
              height: 600,
              width: 600,
              thumbhash: product.images.edges[0].node.thumbhash || undefined,
            }
          : { url: '', altText: '', height: 0, width: 0 },
        currencyCode: merchandise.price.currencyCode,
        priceRange: {
          minVariantPrice: merchandise.price,
          maxVariantPrice: merchandise.price,
        },
        compareAtPrice: undefined,
        seo: { title: product.title, description: '' },
        options: [],
        tags: [],
        variants: [],
        images:
          product.images?.edges?.map((edge: any) => ({
            ...edge.node,
            altText: edge.node.altText || product.title,
            height: 600,
            width: 600,
          })) || [],
        availableForSale: true,
      },
    },
  } satisfies CartItem;
}

function adaptCart(shopifyCart: ShopifyCart | null): Cart | null {
  if (!shopifyCart) return null;

  const lines = shopifyCart.lines?.edges?.map((edge: any) => adaptCartLine(edge.node)) || [];

  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    cost: {
      subtotalAmount: shopifyCart.cost.subtotalAmount,
      totalAmount: shopifyCart.cost.totalAmount,
      totalTaxAmount: shopifyCart.cost.totalTaxAmount,
    },
    totalQuantity: lines.reduce((sum: number, line: CartItem) => sum + line.quantity, 0),
    lines,
  } satisfies Cart;
}

async function getOrCreateCartId(): Promise<string> {
  let cartId = getCookie('cartId');
  if (!cartId) {
    const newCart = await createShopifyCart();
    cartId = newCart.id;
    setCookie('cartId', cartId, 30);
  }
  return cartId;
}

// Add item client action: returns adapted Cart
export async function addItem(variantId: string | undefined): Promise<Cart | null> {
  if (!variantId) return null;
  try {
    const cartId = await getOrCreateCartId();
    await addCartLines(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
    const fresh = await getShopifyCart(cartId);
    return adaptCart(fresh);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return null;
  }
}

// Update item client action (quantity 0 removes): returns adapted Cart
export async function updateItem({ lineId, quantity }: { lineId: string; quantity: number }): Promise<Cart | null> {
  try {
    const cartId = getCookie('cartId');
    if (!cartId) return null;

    if (quantity === 0) {
      await removeCartLines(cartId, [lineId]);
    } else {
      await updateCartLines(cartId, [{ id: lineId, quantity }]);
    }

    const fresh = await getShopifyCart(cartId);
    return adaptCart(fresh);
  } catch (error) {
    console.error('Error updating item:', error);
    return null;
  }
}

export async function createCartAndSetCookie() {
  try {
    const newCart = await createShopifyCart();
    setCookie('cartId', newCart.id, 30);
    return newCart;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

export async function getCart(): Promise<Cart | null> {
  try {
    const cartId = getCookie('cartId');

    if (!cartId) {
      return null;
    }
    const fresh = await getShopifyCart(cartId);
    return adaptCart(fresh);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

