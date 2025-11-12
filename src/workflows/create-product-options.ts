// Based on the product type we set the predefined product options
import { Modules } from "@medusajs/framework/utils";
import {
    createStep,
    createWorkflow,
    WorkflowResponse,
    StepResponse
} from "@medusajs/framework/workflows-sdk";
import { createProductOptionsWorkflow } from "@medusajs/medusa/core-flows";

type ProductOptionsBasedOnType = {
    [key: string]: {
        title: string;
        values: string[]
    }[]
};

const productOptions: ProductOptionsBasedOnType = {
    "ring": [
        {
            title: "Karat",
            values: [
                "14",
                "18"
            ]
        },
    ],
    "bracelet": [
        {
            title: "Karat",
            values: [
                "14",
                "18"
            ]
        },
        {
            title: "Size",
            values: [
                "16",
                "18",
                "20",
                "22",
            ]
        }
    ]
};


type PopulateProductOptionsInput = {
    productId: string;
    productTypeId: string;
}


// Step to populate product options based on product type
const CreateProductOptionsStep = createStep(
    "populate-product-options",
    async ({ productId, productTypeId }: PopulateProductOptionsInput, { container }) => {

        const productService = container.resolve(Modules.PRODUCT)
        const product_type = await productService.listProductTypes({ id: productTypeId })

        if (!product_type.length) {
            return new StepResponse({
                success: false,
                message: `No predefined options found for product type: ${productTypeId}`,
                createdOptions: [],
                productType: productTypeId
            });
        }

        const product_type_name = product_type[0]?.value ?? null
        const _product_options = productOptions[product_type_name];


        try {
            const createdOptions = await createProductOptionsWorkflow(container).run({
                input: {
                    product_options: _product_options.map(option => ({
                        ...option,
                        product_id: productId
                    }))
                }
            })

            return new StepResponse({
                success: true,
                message: `Successfully created ${createdOptions.result.length} options for product type: ${productTypeId}`,
                createdOptions: createdOptions.result,
                productType: productTypeId
            });
        } catch (error) {
            return new StepResponse({
                success: false,
                message: `Failed to create product options: ${error}`,
                createdOptions: [],
                productType: productTypeId
            });
        }
    }
);

// Main workflow to populate product options
const CreateProductOptionsWorkflow = createWorkflow(
    "populate-product-options-workflow",
    (input: PopulateProductOptionsInput) => {
        const result = CreateProductOptionsStep(input);

        return new WorkflowResponse({
            success: result.success,
            message: result.message,
            createdOptions: result.createdOptions,
            productType: result.productType
        });
    }
);

export default CreateProductOptionsWorkflow;
export { CreateProductOptionsStep };

