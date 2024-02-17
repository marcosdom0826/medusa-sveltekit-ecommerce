import type {
    MiddlewaresConfig,
    MedusaRequest,
    MedusaResponse,
    MedusaNextFunction,
} from "@medusajs/medusa";

const defaultExpandWithCategories = [
    "categories",
    // original defaults
    "variants",
    "variants.prices",
    "variants.options",
    "options",
    "options.values",
    "images",
    "tags",
    "collection",
    "type",
    "profiles",
];

async function categoryInclude(
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) {
    if (!req.query.expand) {
        // medusa does not seem to use query.params from express, keep it here for other middlewares
        req.query = { ...req.query, expand: defaultExpandWithCategories.join(",") };
        // stupidly patch the url as that's was medusajs uses.................. ... . . .. . ..  .. . . . . . . . . 
        req.url = `${req.url}${req.url.includes("?") ? "&" : "?"}expand=${defaultExpandWithCategories.join(",")}`;
    }

    next();
}

export const config: MiddlewaresConfig = {
    routes: [
        {
            matcher: "/store/products",
            middlewares: [categoryInclude],
        },
    ],
};