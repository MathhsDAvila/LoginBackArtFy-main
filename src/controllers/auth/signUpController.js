import { create, userValidator } from "../../models/userModel.js"
import bcrypt from 'bcrypt'

export default async function signUpController(req, res, next){
    try{
        const user = req.body
        
        // Verifica se há uma chave de admin secreta
        if (user.adminSecret && user.adminSecret === process.env.ADMIN_SECRET_KEY) {
            user.role = 'ADMIN'
            delete user.adminSecret
        }

        const { success, error, data } = userValidator(user, {id: true})

        if(!success){
            return res.status(400).json({
                message: "Erro ao validar os dados do usuário!",
                errors: error.flatten().fieldErrors
            })
        }

        data.pass = bcrypt.hashSync(data.pass, 10)

        const result = await create(data)

        if(!result){
            return res.status(500).json({
                message: "Erro ao criar usuário!"
            })
        }
        
        return res.status(201).json({
            message: "Usuário criado com sucesso!",
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
        if(error?.code === "P2002"){
            if(error?.meta?.target === "user_email_key"){
                return res.status(400).json({
                    message: "Erro ao criar usuário!",
                    errors: {
                        email: ["Email já cadastrado!"]
                    }
                })
            }
            if(error?.meta?.target === "user_cpf_key"){
                return res.status(400).json({
                    message: "Erro ao criar usuário!",
                    errors: {
                        cpf: ["CPF já cadastrado!"]
                    }
                })
            }
        }

        next(error)
    }
}