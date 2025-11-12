import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductOptionsTemplateModule from "../modules/product-option-templates";

export default defineLink(
    {
        linkable: ProductModule.linkable.productType,
        field: "id"
    },
    {
        ...ProductOptionsTemplateModule.linkable.productOptionTemplate.id,
        primaryKey: "product_type_id",
        isList: true
    },
    {
        readOnly: true
    }
)