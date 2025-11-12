import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Table, DropdownMenu, IconButton, toast, Skeleton, Badge } from "@medusajs/ui"
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons"
import EmptyTableContent from "../components/empty-table-content"
import sdk from "../lib/sdk"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AdminProductType, DetailWidgetProps, } from "@medusajs/framework/types"
import { ProductOptionTemplateType } from "../../modules/product-option-templates/types"
import { QUERY_KEY_PRODUCT_TYPE_OPTION_TEMPLATES } from "../lib/querykeys"
import { ProductOptionTemplateDrawer } from "../components/edit-option/edit-option-drawer"
import { useState } from "react"


const ProductOptionTemplatesWidget = ({ data }: DetailWidgetProps<AdminProductType>) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [drawerMode, setDrawerMode] = useState<"create" | "update">("create")
    const [editingOption, setEditingOption] = useState<Omit<ProductOptionTemplateType, "id"> & { id?: string }>({ title: "", values: [] })

    const queryClient = useQueryClient()

    const { data: productOptionsTemplates, isLoading } = useQuery({
        queryKey: QUERY_KEY_PRODUCT_TYPE_OPTION_TEMPLATES(data.id),
        queryFn: () => sdk.client.fetch(`/admin/product-types/${data.id}/variant-option-templates`) as Promise<ProductOptionTemplateType[]>
    })

    const deleteOptionMutation = useMutation({
        mutationFn: (option: ProductOptionTemplateType) => sdk.client.fetch(`/admin/product-types/${data.id}/variant-option-templates/${option.id}`, {
            method: "DELETE"
        }),
        onSuccess: (_, option) => {
            toast.success(`Option ${option.title} deleted successfully`)
            queryClient.invalidateQueries({ queryKey: QUERY_KEY_PRODUCT_TYPE_OPTION_TEMPLATES(data.id) })
        },
        onError: (error: any) => {
            toast.error(`Failed to delete option: ${error.message}`)
        }
    })

    const handleEditOption = (option: ProductOptionTemplateType) => {
        setEditingOption(option)
        setDrawerMode("update")
        setIsDrawerOpen(true)
    }

    const handleCreateOption = () => {
        setEditingOption({ title: "", values: [] })
        setDrawerMode("create")
        setIsDrawerOpen(true)
    }

    return (
        <>
            <Container className="divide-y p-0">
                <div className="flex items-center justify-between px-6 py-4">
                    <Heading level="h2">Product Option Templates</Heading>
                    <Button variant="secondary" size="small" onClick={handleCreateOption}>
                        <Plus />
                        Add Option
                    </Button>
                </div>

                <div>
                    {isLoading ? (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Values</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[...Array(4)].map((_, index) => (
                                    <Table.Row>
                                        <Table.Cell {...({ colSpan: 3 } as any)} className="p-0">
                                            <div className="flex flex-col divide-y border-y w-full">
                                                <Skeleton key={index} className="h-10 w-full rounded-none" />
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    ) : productOptionsTemplates?.length === 0 ? (
                        <div className="p-10">
                            <EmptyTableContent />
                        </div>
                    ) : (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Title</Table.HeaderCell>
                                    <Table.HeaderCell>Values</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {productOptionsTemplates?.map((option: ProductOptionTemplateType) =>
                                    <Table.Row
                                        key={option.id}
                                        className="cursor-pointer hover:bg-ui-bg-field-component-hover"
                                        onClick={() => handleEditOption(option)}
                                    >
                                        <Table.Cell>{option.title}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex flex-wrap gap-1">
                                                {option.values.map((value) => (
                                                    <Badge size="2xsmall" key={value}>{value}</Badge>
                                                ))}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenu.Trigger asChild>
                                                    <IconButton
                                                        variant="transparent"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <EllipsisHorizontal />
                                                    </IconButton>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content className="divide-y">
                                                    <DropdownMenu.Item
                                                        className=""
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleEditOption(option)
                                                        }}
                                                    >
                                                        <PencilSquare className="text-ui-fg-subtle mr-2" />
                                                        Edit
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteOptionMutation.mutate(option)
                                                        }}
                                                    >
                                                        <Trash className="text-ui-fg-subtle mr-2" />
                                                        Delete
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    )}
                </div>
            </Container>

            <ProductOptionTemplateDrawer
                isOpen={isDrawerOpen}
                product_type_id={data.id}
                option={editingOption}
                mode={drawerMode}
                onOpenChange={setIsDrawerOpen}
            />
        </>
    )
}

export const config = defineWidgetConfig({
    zone: "product_type.details.after"
})

export default ProductOptionTemplatesWidget
