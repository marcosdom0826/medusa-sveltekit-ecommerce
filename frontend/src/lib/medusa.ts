import Medusa from '@medusajs/medusa-js';
export const medusa = new Medusa({
    baseUrl: 'http://localhost:9000',
    maxRetries: 3
});

export type ProductCategory = Awaited<ReturnType<typeof medusa.productCategories.list>>['product_categories'][0];
