import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MODULE_productOptionsTemplate } from "../../../../../../modules/product-option-templates"
import { ProductOptionTemplateType } from "../../../../../../modules/product-option-templates/types"
import { ProductOptionsTemplateService } from "../../../../../../modules/product-option-templates/service"

export const POST = async (
    req: MedusaRequest<{ option_template_id: string }>,
    res: MedusaResponse
) => {
    const { product_id } = req.params
    const { option_template_id } = req.body

    const optionTemplateService: ProductOptionsTemplateService = req.scope.resolve(MODULE_productOptionsTemplate)

    const optionTemplate = await optionTemplateService.retrieveProductOptionTemplate(option_template_id)

    const productModuleService = req.scope.resolve("product")
    await productModuleService.createProductOptions({
        title: optionTemplate.title,
        values: optionTemplate.values,
        product_id
    })

    res.json({
        success: true,
        message: "Product options created successfully"
    })
}