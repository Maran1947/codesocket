import { executeCompiler } from "../compiler/compiler.js"

const initApiRoutes = (app) => {
    app.get('/', (_req, res) => {
        return res.status(200).send('Welcome to CodeSocket APIs')
    })

    app.post('/api/code/execute', async(req, res) => {
        const { language, extension, code } = req.body
        try {
            const response = await executeCompiler(language, extension, code)
            return res.status(200).json({ response })
        } catch (error) {
            return res.status(500).json({ error })
        }
    })
}

export { initApiRoutes }