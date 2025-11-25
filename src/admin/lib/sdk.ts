import Medusa from "@medusajs/js-sdk"

const sdk = new Medusa({
    baseUrl: __BACKEND_URL__ || "/",
    auth: {
        type: "session",
    },
})

export default sdk