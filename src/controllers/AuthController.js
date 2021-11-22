import jwt from 'jsonwebtoken'
import { findUserByEmail } from '../services/User'
import validateFields from './validateFields'
import bcrypt from 'bcrypt'

export async function loginUser(req, res) {
  let { email, password } = req.body
  let { status, errors } = validateFields({ email, password })

  //verificando se algum dado foi enviado de maneira incorreta
  if (!status) return res.status(406).json({ status: 406, error: errors })

  try {
    //procurando por e-mail no banco de dados
    let { status, user } = await findUserByEmail(email)

    //verificando se houve algum erro na busca do usuário
    if (!status)
      return res
        .status(500)
        .json({ status: 500, error: [{ internalError: 'Erro interno' }] })

    //verificando se o e-mail foi encontrado no db
    if (user.length === 0) {
      return res
        .status(404)
        .json({ status: 404, error: [{ email: 'E-mail não encontrado' }] })
    } else {
      //comparando a senha existente no db com a senha enviada pelo usuário
      let isEqual = await bcrypt.compare(password, user[0].password)

      //verificando se a senha está correta
      if (!isEqual)
        return res
          .status(406)
          .json({ status: 406, error: [{ password: 'Senha incorreta' }] })

      //criando token pra o usuário
      let token = jwt.sign({ id: user[0].id }, process.env.SECRET, {
        expiresIn: '30d'
      })
      return res.json({ status: 200, token })
    }
  } catch (error) {
    console.log(error.message)

    return res
      .status(500)
      .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
  }
}
