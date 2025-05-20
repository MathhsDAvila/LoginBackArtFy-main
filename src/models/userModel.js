import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const userSchema = z.object({
    id: z.number({
        invalid_type_error: "O id deve ser um valor numérico.",
        required_error: "O id é obrigatório."
    }),
    name: z.string({
        invalid_type_error: "O nome deve ser uma string.",
        required_error: "O nome é obrigatório."
    })
    .min(3, {message: "O nome deve ter no mínimo 3 caracteres."})
    .max(255, {message: "O nome deve ter no máximo 255 caracteres."}),
    email: z.string({
        invalid_type_error: "O email deve ser uma string.",
        required_error: "O email é obrigatório."
    })
    .email({message: "Email inválido."}),
    pass: z.string({
        invalid_type_error: "A senha deve ser uma string.",
        required_error: "A senha é obrigatória."
    })
    .min(8, {message: "A senha deve ter no mínimo 8 caracteres."})
    .max(255, {message: "A senha deve ter no máximo 255 caracteres."}),
    cpf: z.string({
        invalid_type_error: "O CPF deve ser uma string.",
        required_error: "O CPF é obrigatório."
    })
    .length(14, {message: "O CPF deve ter 14 caracteres (incluindo pontuação)."}),
    birthDate: z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "A data deve estar no formato AAAA-MM-DD"
  }),
  z.date()
]).transform(str => new Date(str)), // Converte string para Date
    address: z.string({
        invalid_type_error: "O endereço deve ser uma string.",
        required_error: "O endereço é obrigatório."
    })
    .max(255, {message: "O endereço deve ter no máximo 255 caracteres."}),
    phone: z.string({
        invalid_type_error: "O telefone deve ser uma string.",
        required_error: "O telefone é obrigatório."
    })
    .max(20, {message: "O telefone deve ter no máximo 20 caracteres."}),
    role: z.enum(['USER', 'ADMIN']).default('USER')
})

export const userValidator = (user, partial = null) => {
    if (partial) {
        return userSchema.partial(partial).safeParse(user)
    } 
    return userSchema.safeParse(user)
} 

const userSelectFields = {
    id: true,
    name: true,
    email: true,
    cpf: true,
    birthDate: true,
    address: true,
    phone: true,
    role: true
}

export async function create(user){
    const result = await prisma.user.create({
        data: user,
        select: userSelectFields
    })
    return result
}

export async function isAdmin(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    })
    return user?.role === 'ADMIN'
}

export async function list(){
    const result = await prisma.user.findMany({
        select: userSelectFields
    })
    return result
}

export async function getById(id){
    const result = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: userSelectFields
    })
    return result
}

export async function getByEmail(email){
    const result = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return result
}

export async function remove(id){
    const result = await prisma.user.delete({
        where: {
            id: id
        },
        select: userSelectFields
    })
    return result
}

export async function update(id, user){
    const result = await prisma.user.update({
        where: {
            id: id
        },
        data: user,
        select: userSelectFields
    })
    return result
}

export async function updateName(id, name){
    const result = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            name: name
        },
        select: userSelectFields
    })
    return result
}