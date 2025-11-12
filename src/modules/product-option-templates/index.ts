import { Module } from "@medusajs/framework/utils"
import { ProductOptionsTemplateService } from "./service"

export const MODULE_productOptionsTemplate = "product_options_template"

const ProductOptionsTemplateModule = Module(MODULE_productOptionsTemplate, {
    service: ProductOptionsTemplateService,
})

export default ProductOptionsTemplateModule