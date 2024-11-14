import { defineConfig } from 'vite'

const cfg = defineConfig(async ({ command, mode }) => {
    return {
        server: {
            host: "0.0.0.0",
            port: 3000
        },
        preview: {
            host: "0.0.0.0",
            port: 3000
        },
        root: process.cwd(),
        publicDir: "public",
    }
})

export default cfg;