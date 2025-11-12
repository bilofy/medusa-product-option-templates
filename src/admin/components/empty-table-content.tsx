import { ExclamationCircle } from "@medusajs/icons"
import { Text } from "@medusajs/ui"

const EmptyTableContent: React.FC<{
    title?: string
    message?: string
}> = ({ title, message }) => {
    return (
        <div className="flex flex-col items-center gap-y-3">
            <ExclamationCircle className="text-ui-fg-subtle" />

            <div className="flex flex-col items-center gap-y-1">
                <Text size="small" leading="compact" weight="plus">
                    {title ?? "No records"}
                </Text>

                <Text size="small" className="text-ui-fg-muted">
                    {message ?? "There are no records to show"}
                </Text>
            </div>
        </div>
    )
}

export default EmptyTableContent