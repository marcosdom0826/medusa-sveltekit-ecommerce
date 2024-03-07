import Medusa from '@medusajs/medusa-js';
export const medusa = new Medusa({
    baseUrl: 'http://localhost:9000',
    maxRetries: 3
});

export type ProductCategory = Awaited<ReturnType<typeof medusa.productCategories.list>>['product_categories'][0];
export type PricedProduct = Awaited<ReturnType<typeof medusa.products.list>>['products'][0];

export type ProductOption = Required<PricedProduct>['options'][number];
export type ProductOptionValue = Required<ProductOption>['values'][number];
export type ProductVariant = Required<PricedProduct>['variants'][number];
export type Cart = Required<Awaited<ReturnType<typeof medusa.carts.retrieve>>>['cart'];
export type CartItem = Required<Awaited<ReturnType<typeof medusa.carts.retrieve>>>['cart']['items'][0];
