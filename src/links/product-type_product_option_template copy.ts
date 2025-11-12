import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductOptionsTemplateModule from "../modules/product-option-templates";

export default defineLink(
    {
        linkable: ProductModule.linkable.product,
        field: "type_id"
    },
    {
        ...ProductOptionsTemplateModule.linkable.productOptionTemplate.id,
        primaryKey: "product_type_id"
    },
    {
        readOnly: true
    }
)