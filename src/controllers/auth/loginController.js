import { userValidator, getByEmail } from "../../models/userModel.js"
import { create } from "../../models/sessionModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default async function loginController(req, res, next){
    try{
        const user = req.body
        const { success, error, data } = userValidator(user, {
            id: true, 
            name: true, 
            cpf: true,
            birthDate: true,
            address: true,
            phone: true,
            role: true
        })

        if(!success){
            return res.status(400).json({
                message: "Erro ao validar os dados do login!",
                errors: error.flatten().fieldErrors
            })
        }

        const result = await getByEmail(data.email)

        if(!result){
            return res.status(400).json({
                message: "Usuário ou senha inválidos! (Usuário não encontrado)",
            })
        }

        const passIsValid = bcrypt.compareSync(data.pass, result.pass)

        if(!passIsValid){
            return res.status(400).json({
                message: "Usuário ou senha inválidos! (Senha não confere)",
            })
        }

        const payload = {
            id: result.id,
            role: result.role
        }

        const sessionResult = await create(result.id, req.headers['user-agent'])

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({...payload, sessionId: sessionResult.id}, process.env.JWT_SECRET, { expiresIn: '3d' })
        
        res.cookie('refreshToken', refreshToken, { 
            httpOnly: true, 
            sameSite: 'None', 
            secure: true, 
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            accessToken: accessToken,
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role,
                cpf: result.cpf,
                birthDate: result.birthDate,
                phone: result.phone
            }
        })
    } catch(error){
        next(error)
    }
}