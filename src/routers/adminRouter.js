import { Router } from 'express'
import adminAuth from '../middlewares/adminAuth.js'
import { getDashboardStats } from '../controllers/adminController.js'

const router = Router()

// Todas as rotas aqui exigem autenticação de admin
router.use(adminAuth)

// Exemplo de rotas administrativas
router.get('/dashboard', getDashboardStats)
router.get('/users', /* controller para listar usuários */)
// Adicione outras rotas administrativas conforme necessário

export default router