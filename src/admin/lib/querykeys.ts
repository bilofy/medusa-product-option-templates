export const QUERY_KEY_PRODUCT_TYPE_OPTION_TEMPLATES = (product_type_id: string) => ["product-type-option-templates", product_type_id]
export const QUERY_KEY_PRODUCT_OPTION_TEMPLATES = (product_id: string) => ["product-type-option-template", product_id]

export const QUERY_KEY_PRODUCT_DETAILS = (product_id: string) => [
    "products",
    "detail",
    product_id,
    {
        "query": {
            "fields": "*categories,*shipping_profile,-variants"
        }
    }
]