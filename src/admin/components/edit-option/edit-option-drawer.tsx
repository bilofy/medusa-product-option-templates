import { Drawer, Button, toast } from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import sdk from "../../lib/sdk"
import { ProductOptionTemplateForm } from "./edit-option-form"
import { ProductOptionTemplateType } from "../../../modules/product-option-templates/types"
import { QUERY_KEY_PRODUCT_TYPE_OPTION_TEMPLATES } from "../../lib/querykeys"

type _ProductOptionTemplateType = Omit<ProductOptionTemplateType, "id"> & { id?: string }

type ProductOptionTemplateDrawerProps = {
    isOpen: boolean
    product_type_id: string
    option: _ProductOptionTemplateType
    mode: "create" | "update"
    onOpenChange: (open: boolean) => void
}

export const ProductOptionTemplateDrawer = ({
    isOpen,
    product_type_id,
    option,
    mode,
    onOpenChange
}: ProductOptionTemplateDrawerProps) => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (option: _ProductOptionTemplateType) => {
            if (mode === "create") {
                return sdk.client.fetch(`/admin/product-types/${product_type_id}/variant-option-templates`, {
                    method: "POST",
                    body: {
                        title: option.title,
                        values: option.values
                    }
                })
            } else {
                return sdk.client.fetch(`/admin/product-types/${product_type_id}/variant-option-templates/${option.id}`, {
                    method: "PUT",
                    body: {
                        title: option.title,
                        values: option.values
                    }
                })
            }
        },
        onSuccess: (_, option) => {
            toast.success(`Option ${option.title} saved successfully`)
            queryClient.invalidateQueries({ queryKey: QUERY_KEY_PRODUCT_TYPE_OPTION_TEMPLATES(product_type_id) })
            onOpenChange(false)
        },
        onError: (error: any) => {
            toast.error(`Failed to save option values: ${error.message}`)
        },
    })

    const handleSubmit = (option: _ProductOptionTemplateType) => {
        mutation.mutate(option)
    }

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title className="text-xl">{mode === "create" ? "Create" : "Update"} Product Option</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body className="p-6 ">
                    <ProductOptionTemplateForm
                        option={option}
                        onSubmit={handleSubmit}
                    />
                </Drawer.Body>
                <Drawer.Footer>
                    <Drawer.Close asChild>
                        <Button
                            variant="secondary"
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </Button>
                    </Drawer.Close>
                    <Button
                        onClick={() => {
                            const form = document.querySelector('form');
                            if (form) {
                                form.requestSubmit();
                            }
                        }}
                        disabled={mutation.isPending}
                    >
                        Save
                    </Button>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    )
} 