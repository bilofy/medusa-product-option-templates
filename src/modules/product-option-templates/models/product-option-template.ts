import { PropertyType } from "@medusajs/framework/types";
import { model } from "@medusajs/framework/utils";

export const ProductOptionTemplate = model.define("product_option_template", {
    id: model.id({ prefix: "opttemp" }).primaryKey(),
    product_type_id: model.text(),
    title: model.text(),
    values: model.json().default([] as any) as any as PropertyType<string[]>
})