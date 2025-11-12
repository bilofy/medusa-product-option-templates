import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ProductOptionTemplateType } from "../../../../../modules/product-option-templates/types"

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { product_id } = req.params

    const query = req.scope.resolve("query")
    const productModuleService = req.scope.resolve("product")

    const productResult = await query.graph({
        entity: "product",
        fields: ["id", "type_id", "options.title", "product_option_template.*"],
        filters: { id: product_id },
    })
    const product = productResult.data[0]

    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }

    const product_type_id = product.type_id

    if (!product_type_id) {
        return res.status(400).json({ message: "No product type is assigned to this product" })
    }

    const existingTitles = new Set<string>((product.options ?? []).map((o: any) => o.title ?? ""))

    const optionTemplates = product.product_option_template as any as Array<ProductOptionTemplateType> ?? []

    const toCreate = optionTemplates.filter((t) => !existingTitles.has(t.title))

    await Promise.all(
        toCreate.map((tpl) =>
            productModuleService.createProductOptions({
                title: tpl.title,
                values: tpl.values,
                product_id
            })
        )
    )

    res.json({})
}
