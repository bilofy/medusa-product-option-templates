import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { product_id } = req.params

    const product = await req.scope.resolve("query").graph({
        entity: "product",
        fields: ["product_option_template.*"],
        filters: {
            id: product_id
        }
    })

    const templates = product.data.flatMap(product =>
        product.product_option_template || []
    )

    res.json(templates)
}