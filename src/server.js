import express from 'express'
import authRouter from './routers/authRouter.js'
import userRouter from './routers/userRouter.js'
import productRouter from './routers/productRouter.js'
import { logger } from './middlewares/logger.js'
import cors from 'cors'
import { errorsHandler } from './middlewares/errorsHandler.js'
import welcomeController from './controllers/welcomeController.js'
import notFoundController from './controllers/notFoundController.js'
import cookieParser from 'cookie-parser'
import adminRouter from './routers/adminRouter.js' // Alterei para adminRouter para consistência

const app = express()

// Middlewares
app.use(logger)
app.use(cors({
  origin: true, // Ou especifique seu frontend: 'http://localhost:5173'
  credentials: true // Importante para cookies
}))
app.use(express.json())
app.use(cookieParser())

// Rotas
app.get('/', welcomeController)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouter) // Todas as rotas aqui serão protegidas
app.use('/product', productRouter)
app.use('*', notFoundController)

// Error handler
app.use(errorsHandler)

app.listen(3000, () => {
    console.log('Servidor rodando no http://localhost:3000')
})