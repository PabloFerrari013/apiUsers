import database from '../database/database'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

async function sendtoken(token, email) {
  //aqui eu vou enviar via e-mail o token do usuário
  console.log(token)
  return { status: true }
}

export async function newToken(email) {
  try {
    //criando token de expiração
    let expirationToken = jwt.sign({ email }, process.env.SECRET, {
      expiresIn: '1d'
    })

    //criando token de verificação
    let token = uuidv4().replace(/-/g).slice(-5)

    //inserindo token no banco de dados
    await database
      .insert({
        id: uuidv4(),
        expirationToken,
        token,
        user_email: email,
        used: 0
      })
      .into('tokens')

    //enviando token para o usuário
    let { status } = await sendtoken(token, email)

    //verificando se holve algum erro no envio do token
    if (!status) return { status: false }

    return { status: true, expirationToken }
  } catch (error) {
    console.log(error.message)

    return { status: false }
  }
}

export async function findToken(token) {
  try {
    //procurando por token de verificação no banco de dados
    let tokenDB = await database.select().where({ token }).table('tokens')

    return { status: true, tokenDB }
  } catch (error) {
    console.log(error.message)

    return { status: false }
  }
}

export async function setToken(id) {
  try {
    //setando token como usado no db
    await database.where({ id }).update({ used: 1 }).table('tokens')

    return { status: true }
  } catch (error) {
    console.log(error.message)

    return { status: false }
  }
}
