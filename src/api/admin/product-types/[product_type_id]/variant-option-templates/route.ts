import type {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { ProductOptionsTemplateService } from "../../../../../modules/product-option-templates/service"
import { MODULE_productOptionsTemplate } from "../../../../../modules/product-option-templates"

type CreateOptionTemplateRequest = {
    title: string
    values: string[]
}

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { product_type_id } = req.params


    const productOptionsTemplateService: ProductOptionsTemplateService = req.scope.resolve(MODULE_productOptionsTemplate)

    const templates = await productOptionsTemplateService.listProductOptionTemplates(
        { product_type_id }
    )

    res.json(templates)
}

export const POST = async (
    req: MedusaRequest<CreateOptionTemplateRequest>,
    res: MedusaResponse
) => {
    const { product_type_id } = req.params
    const { title, values } = req.body

    if (!title) {
        return res.status(400).json({
            message: "Option title is required",
        })
    }

    const productOptionsTemplateService: ProductOptionsTemplateService = req.scope.resolve(
        MODULE_productOptionsTemplate
    )

    await productOptionsTemplateService.createProductOptionTemplates({
        product_type_id,
        title,
        values: values as any || [],
    })

    res.status(201).json({})
}