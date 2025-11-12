import { useState } from "react"
import { Input, Label, Text } from "@medusajs/ui"
import { ProductOptionTemplateType } from "../../../modules/product-option-templates/types"
import { ChipInput } from "../chip-input"

type ValidationErrors = {
    title?: string
}

type _ProductOptionTemplateType = Omit<ProductOptionTemplateType, "id"> & { id?: string }

type ProductOptionTemplateFormProps = {
    option: _ProductOptionTemplateType
    onSubmit: (option: _ProductOptionTemplateType) => void
}

export const ProductOptionTemplateForm = ({
    option,
    onSubmit
}: ProductOptionTemplateFormProps) => {
    const [_option, setOption] = useState<_ProductOptionTemplateType>(option)
    const [errors, setErrors] = useState<ValidationErrors>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        if (!_option.title) {
            setErrors({ title: "Option title is required" })
            return
        }

        onSubmit(_option)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6" onChange={() => setErrors({})}>
            <div className="space-y-1">
                <Label>Option title</Label>
                <Input
                    value={_option.title}
                    onChange={e => setOption({ ..._option, title: e.target.value })}
                    placeholder="Color"
                    autoFocus
                    aria-invalid={errors.title ? "true" : "false"}
                />
                {errors.title && (
                    <Text size="small" className="text-red-500">
                        {errors.title}
                    </Text>
                )}
            </div>
            <div className="space-y-1">
                <Label>Variations (comma-separated)</Label>
                <ChipInput
                    value={_option.values}
                    showRemove
                    onChange={e => setOption({ ..._option, values: e })}
                    placeholder="Red, Blue, Green"
                />
            </div>
        </form>
    )
} 