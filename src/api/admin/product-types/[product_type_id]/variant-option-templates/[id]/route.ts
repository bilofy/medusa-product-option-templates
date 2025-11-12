import type {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { ProductOptionsTemplateService } from "../../../../../../modules/product-option-templates/service"
import { MODULE_productOptionsTemplate } from "../../../../../../modules/product-option-templates"

type UpdateTemplateRequest = {
    title?: string
    values?: string[]
}

export const PUT = async (
    req: MedusaRequest<UpdateTemplateRequest>,
    res: MedusaResponse
) => {
    const { id } = req.params
    const { title, values } = req.body

    const productOptionsTemplateService: ProductOptionsTemplateService = req.scope.resolve(
        MODULE_productOptionsTemplate
    )

    const updateData: any = {}

    if (title !== undefined) {
        updateData.title = title
    }

    if (values !== undefined) {
        if (!Array.isArray(values)) {
            return res.status(400).json({
                message: "Values must be an array",
            })
        }
        updateData.values = values as any || []
    }

    await productOptionsTemplateService.updateProductOptionTemplates({
        id: id,
        ...updateData
    })

    res.json({})
}

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { id } = req.params

    const productOptionsTemplateService: ProductOptionsTemplateService = req.scope.resolve(
        MODULE_productOptionsTemplate
    )

    await productOptionsTemplateService.deleteProductOptionTemplates([id])

    res.send({})
}
