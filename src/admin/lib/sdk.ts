import Medusa from "@medusajs/js-sdk"

const sdk = new Medusa({
    baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
    auth: {
        type: "session",
    },
})

export default sdk