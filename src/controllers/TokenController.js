import { findToken, newToken, setToken } from '../services/Token'
import { findUserByEmail, newPass } from '../services/User'
import validateFields from './validateFields'
import jwt from 'jsonwebtoken'

export async function recover(req, res) {
  let { email } = req.body
  let { status, errors } = validateFields({ email })

  //verificando se algum dado foi enviado de maneira incorreta
  if (!status) return res.status(406).json({ status: 406, error: errors })

  try {
    //procurando por usuário na db
    let { status, user } = await findUserByEmail(email)

    //verificando se houve algum erro na busca pelo usuário
    if (!status)
      return res
        .status(500)
        .json({ status: 500, error: [{ internalError: 'Erro interno' }] })

    //verificando se o usuário foi encontrado no banco de dados
    if (user.length === 0) {
      return res
        .status(404)
        .json({ status: 404, error: [{ email: 'E-mail não encontrado' }] })
    } else {
      //criando e enviando token
      let { status } = await newToken(email)

      //verificando se houve algum erro na criação e envio do token
      if (!status)
        return res
          .status(500)
          .json({ status: 500, error: [{ internalError: 'Erro interno' }] })

      return res.json({ status: true })
    }
  } catch (error) {
    console.log(error.message)

    return res
      .status(500)
      .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
  }
}

async function validateToken(token, email) {
  try {
    //procurando por token no db
    let { status, tokenDB } = await findToken(token)

    //verificando se houve algum erro na busca pelo token
    if (!status)
      return { status: 500, error: [{ internalError: 'Erro interno' }] }

    //verificando se o token foi encontrado
    if (tokenDB.length === 0)
      return {
        status: 406,
        error: [{ token: 'Token incorreto' }]
      }

    //verificando se o token já foi usado
    if (tokenDB[0].used === 1)
      return {
        status: 406,
        error: [{ token: 'O token já foi usado' }]
      }

    //verificando se o e-mail do usuário é o mesmo presente no token
    if (email != tokenDB[0].user_email)
      return {
        status: 406,
        error: [{ email: 'E-mail inválido' }]
      }

    try {
      //verificando se o token é válido
      jwt.verify(tokenDB[0].expirationToken, process.env.SECRET)

      return { status: 200, tokenDB: tokenDB[0] }
    } catch (error) {
      console.log(error.message)

      //verificando se o erro foi disparado devido a expiração do token
      if (error.message == 'jwt expired')
        return { status: 406, error: [{ token: 'Token expirado' }] }

      console.log(error.message)
      return { status: 500, error: [{ internalError: 'Erro interno' }] }
    }
  } catch (error) {
    console.log(error.message)

    return { status: 500, error: [{ internalError: 'Erro interno' }] }
  }
}

export async function changePassword(req, res) {
  let { token, email, password } = req.body
  let { status, errors } = validateFields({ token, email, password })

  //verificando se algum dado foi enviado de maneira incorreta
  if (!status) return res.status(406).json({ status: 406, error: errors })

  try {
    //procurando por usuário no db
    let { status, user } = await findUserByEmail(email)

    //verificando se holve algum erro na busca pelo usuário
    if (!status) {
      return res
        .status(500)
        .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
    }
    //verificando se o usuário foi encontrado no db
    else if (user.length === 0) {
      return res
        .status(406)
        .json({ status: 406, error: [{ email: 'E-mail incorreto' }] })
    } else {
      //validando token
      let { status, error, tokenDB } = await validateToken(token, email)

      //verificando estado do token
      if (status != 200) {
        return res.status(status).json({ status, error })
      } else {
        //editando senha do usuário
        let { status } = await newPass(user[0].id, password)

        //verificando se houve algum erro na edição da senha
        if (!status) {
          return res
            .status(500)
            .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
        } else {
          //setando token como usado
          console.log(tokenDB)
          let { status } = await setToken(tokenDB.id)

          //verificando se houve algum erro ao setar o token como usado
          if (!status)
            return res
              .status(500)
              .json({ status: 500, error: [{ internalError: 'Erro interno' }] })

          return res.json({ status: 200 })
        }
      }
    }
  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
  }
}
