import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, IconButton, Badge, toast, Input, Button, DropdownMenu, Text } from "@medusajs/ui"
import { Plus, Spinner, Check, EllipsisHorizontal, PencilSquare } from "@medusajs/icons"
import { ProductOptionTemplateType } from "../../modules/product-option-templates/types"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import sdk from "../lib/sdk"
import { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types"
import { QUERY_KEY_PRODUCT_DETAILS, QUERY_KEY_PRODUCT_TYPE_OPTION_TEMPLATES } from "../lib/querykeys"
import React from "react"
import { Row } from "../components/row"
import { Link, useNavigate } from "react-router-dom"

const ProductVariantOptionTemplatesWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const _QUERYKEY_P_DETAILS = React.useMemo(() => QUERY_KEY_PRODUCT_DETAILS(data.id), [data.id])

    const productDetails = queryClient.getQueryData(_QUERYKEY_P_DETAILS) as { product: AdminProduct }
    const currentProductType = productDetails?.product?.type

    const productOptions = productDetails.product.options

    const existingOptionTitles = React.useMemo(() => new Set((productOptions ?? []).map((o) => o.title ?? "")), [productOptions])

    const [search, setSearch] = React.useState("")

    const { data: productOptionsTemplates, isLoading } = useQuery({
        queryKey: QUERY_KEY_PRODUCT_TYPE_OPTION_TEMPLATES(currentProductType?.id!),
        queryFn: () => sdk.client.fetch(`/admin/products/${data.id}/variant-option-templates`) as Promise<ProductOptionTemplateType[]>,
        enabled: !!currentProductType
    })

    const allUsed = React.useMemo(() => {
        if (!productOptionsTemplates) return false
        const notUsed = productOptionsTemplates.filter((t) => !existingOptionTitles.has(t.title))
        return notUsed.length === 0
    }, [productOptionsTemplates, existingOptionTitles])

    const filteredTemplates = React.useMemo(() => {
        if (!productOptionsTemplates) return [] as ProductOptionTemplateType[]
        const q = search.toLowerCase()
        if (!q) return productOptionsTemplates
        return productOptionsTemplates.filter((t) =>
            (t.title ?? "").toLowerCase().includes(q)
        )
    }, [productOptionsTemplates, search])

    const useAllTemplatesMutation = useMutation({
        mutationFn: () => sdk.client.fetch(`/admin/products/${data.id}/use-all`, {
            method: "POST",
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY_PRODUCT_DETAILS(data.id) })
        }
    })

    return (
        <>
            <Container className="divide-y p-0">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <Heading level="h2">Available Product Options</Heading>
                        {currentProductType && (
                            <p className="font-normal font-sans txt-small text-ui-fg-subtle">
                                For Product Type <Badge size="2xsmall">
                                    <Link to={`/settings/product-types/${currentProductType?.id}`}>
                                        {currentProductType?.value}
                                    </Link>
                                </Badge>
                            </p>
                        )}

                    </div>
                    <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                            <IconButton
                                variant="transparent"
                                size="small"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <EllipsisHorizontal />
                            </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Item
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/settings/product-types/${currentProductType?.id}`)
                                }}
                                disabled={!currentProductType}
                            >
                                <PencilSquare className="text-ui-fg-subtle mr-2" />
                                Edit Templates
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu>
                </div>

                <div>
                    {(() => {

                        if (!currentProductType) {
                            return (
                                <div className="p-6">
                                    <Text className="text-ui-fg-subtle text-center">
                                        Assign a product type to this product to get option templates
                                    </Text>
                                </div>
                            )
                        }

                        if (isLoading) {
                            return <div className="text-ui-fg-subtle text-center py-4">Loading...</div>
                        }

                        if (!productOptionsTemplates || productOptionsTemplates.length === 0) {
                            return (
                                <div className="p-6 space-y-4">
                                    <Text className="text-ui-fg-subtle text-center">
                                        No option templates have been created for this product type
                                    </Text>
                                    <div className="flex">
                                        <Button
                                            variant="secondary" size="small"
                                            onClick={() => navigate(`/settings/product-types/${currentProductType?.id}`)}
                                            disabled={!currentProductType}
                                            className="mx-auto text-ui-fg-subtle"
                                        >
                                            <Plus className="mr-1" />
                                            Create Templates
                                        </Button>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div className="divide-y">
                                <div className="px-6 py-3 flex items-center gap-3">
                                    <div className="flex-1">
                                        <Input placeholder="Search" id="search-input" type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        type="button"
                                        onClick={() => useAllTemplatesMutation.mutate()}
                                        disabled={!currentProductType || useAllTemplatesMutation.isPending || allUsed}
                                    >
                                        {useAllTemplatesMutation.isPending ? <Spinner className="animate-spin" /> : "Use All"}
                                    </Button>
                                </div>

                                {filteredTemplates.map((option: ProductOptionTemplateType) => (
                                    <ProductOptionTemplateRow
                                        key={option.id}
                                        option={option}
                                        product_id={data.id}
                                        queryClient={queryClient}
                                        isUsed={existingOptionTitles.has(option.title)}
                                    />
                                ))}

                            </div>
                        )
                    })()}
                </div>
            </Container >
        </>
    )
}

const ProductOptionTemplateRow = ({ option, product_id, queryClient, isUsed }: { option: ProductOptionTemplateType, product_id: string, queryClient: QueryClient, isUsed: boolean }) => {
    const mutation = useMutation({
        mutationFn: (option: ProductOptionTemplateType) =>
            sdk.client.fetch(`/admin/products/${product_id}/variant-option-templates/use`, {
                method: "POST",
                body: {
                    option_template_id: option.id
                }
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY_PRODUCT_DETAILS(product_id) })
        },
        onError: (error) => {
            console.error(error)
            toast.error(`Failed to use option template: ${error.message}`)
        }
    })

    const handleUseTemplate = () => {
        if (isUsed) return
        mutation.mutate(option)
    }

    return (
        <Row
            title={option.title}
            value={option.values.map((value) => (
                <Badge
                    key={value}
                    size="2xsmall"
                    className="flex min-w-[20px] items-center justify-center"
                >
                    {value}
                </Badge>
            ))}
            actions={
                <IconButton
                    size="small"
                    onClick={handleUseTemplate}
                    isLoading={mutation.isPending}
                    disabled={isUsed || mutation.isPending}
                >
                    {mutation.isPending ? (
                        <Spinner className="animate-spin" />
                    ) : isUsed ? (
                        <Check className="text-green-600" />
                    ) : (
                        <Plus />
                    )}
                </IconButton>
            }
        />
    )
}

export const config = defineWidgetConfig({
    zone: "product.details.side.after"
})

export default ProductVariantOptionTemplatesWidget
