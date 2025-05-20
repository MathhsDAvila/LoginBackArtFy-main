import jwt from 'jsonwebtoken'
import { isAdmin } from '../models/userModel.js'

export default async function adminAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({ message: 'Acesso não autorizado' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        if (!(await isAdmin(userId))) {
            return res.status(403).json({ message: 'Acesso restrito a administradores' })
        }

        req.userId = userId
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' })
    }
}