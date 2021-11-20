import database from '../database/database'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function newUser(name, email, password) {
  try {
    //criptografando senha
    let hash = bcrypt.hashSync(password, 10)

    //criando id único
    let id = uuidv4()

    //salvando usuário no db
    await database.insert({ id, name, email, password: hash }).into('users')

    //gerando token do usuário
    let token = jwt.sign({ id, name, email }, process.env.SECRET, {
      expiresIn: '30d'
    })
    return { status: true, token }
  } catch (error) {
    console.log(error.message)

    return { status: false, error: { internalError: 'Erro interno' } }
  }
}

export async function findUserByEmail(email) {
  try {
    //procurando usuário a partir do e-mail no db
    let user = await database.where({ email: email }).table('users')
    return { status: true, user }
  } catch (error) {
    console.log(error)

    return { status: false }
  }
}

export async function findAllUser() {
  try {
    //Listando todos os usuários do db
    let users = await database.select(['id', 'name', 'email']).table('users')
    return { status: true, users }
  } catch (error) {
    console.log(error.message)

    return { status: false }
  }
}

export async function findOneUser(id) {
  try {
    //procurando usuário a partir do id no db
    let user = await database
      .select(['id', 'name', 'email'])
      .where({ id: id })
      .table('users')

    return { status: true, user }
  } catch (error) {
    console.log(error.message)

    return { status: false }
  }
}

export async function updateUser(name, email, password) {
  try {
    //procurando por usuário a partir do e-mail no db
    let { status, user } = await findUserByEmail(email)

    //verificando se houve algum erro na busca pelo usuário
    if (!status)
      return { status: 500, error: [{ internalError: 'Erro interno' }] }

    //verificando se o usuário foi encontrado no db
    if (user.length === 0) {
      return { status: 406, error: [{ user: 'Usuário não encontrado' }] }
    }

    //comparando a senha existente no db com a senha enviada pelo usuário
    const isEqual = await bcrypt.compare(password, user[0].password)

    //verificando se a senha está correta
    if (!isEqual)
      return { status: 406, error: [{ password: 'Senha incorreta' }] }

    //editando usuário
    await database.where({ id: user[0].id }).update({ name }).table('users')

    return { status: 200 }
  } catch (error) {
    console.log(error.message)

    return { status: 500, error: [{ internalError: 'Erro interno' }] }
  }
}

export async function removeUser(id) {
  try {
    //removendo usuário
    await database.where({ id: id }).delete().table('users')

    return { status: true }
  } catch (error) {
    console.log(error.message)

    return { status: false }
  }
}

export async function newPass(id, password) {
  try {
    // codificando senha do usuário
    let hash = bcrypt.hashSync(password, 10)

    //editando senha do usuário
    await database.where({ id }).update({ password: hash }).table('users')

    return { status: true }
  } catch (error) {
    console.log(error.message)

    return { status: false }
  }
}
