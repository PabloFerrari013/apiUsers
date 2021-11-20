import {
  newUser,
  findUserByEmail,
  updateUser,
  findAllUser,
  findOneUser,
  removeUser
} from '../services/User'
import validateFields from './validateFields'

export async function create(req, res) {
  let { name, email, password } = req.body
  let { status, errors } = validateFields(name, email, password)

  //verificando se algum dado foi enviado de maneira incorreta
  if (!status) return res.status(406).json({ status: 406, error: errors })

  try {
    //procurando por e-mail no banco de dados
    let { status, user } = await findUserByEmail(email)

    //verificando se houve algum erro na busca do usuário
    if (!status) {
      return res
        .status(500)
        .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
    } else {
      //verificando se o e-mail já está cadastrado no db
      if (user.length > 0) {
        return res.status(406).json({
          status: 500,
          error: [{ email: 'O e-mail já está cadastrado' }]
        })
      } else {
        //criando usuário no db
        let { status, token } = await newUser(name, email, password)

        //verificando se houve algum na criação do usuário
        if (!status)
          return res
            .status(500)
            .json({ status: 500, error: [{ internalError: 'Erro interno' }] })

        return res.status(200).json({ status: 200, token })
      }
    }
  } catch (error) {
    console.log(error.message)

    return res
      .status(500)
      .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
  }
}

export async function findAll(req, res) {
  try {
    //listando todos os usuários
    let { status, users } = await findAllUser()

    //verificando se houve algum erro na busca dos usuários
    if (!status)
      return res
        .status(500)
        .json({ status: 500, error: [{ internalError: 'Erro interno' }] })

    return res.json({ status: 200, users })
  } catch (error) {
    console.log(error.message)

    return res
      .status(500)
      .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
  }
}

export async function findOne(req, res) {
  let { id } = req.params
  let { status, errors } = validateFields({ id })

  //verificando se o id foi enviado de maneira incorreta
  if (!status) {
    return res.status(406).json({ status: 406, error: errors })
  } else {
    try {
      //procurando por usuário no banco de dados
      let { status, user } = await findOneUser(id)

      //verificando se houve algum erro na busca pelo usuário
      if (!status)
        return res
          .status(500)
          .json({ status: 500, error: [{ internalError: 'Erro interno' }] })

      //verificando se o usuário foi encontrado no db
      if (user.length == 0)
        return res
          .status(404)
          .json({ status: 404, error: [{ user: 'usuário não encontrado' }] })

      return res.json({ status: 200, user })
    } catch (error) {
      console.log(error.message)

      return res
        .status(500)
        .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
    }
  }
}

export async function update(req, res) {
  let { name, email, password } = req.body
  let { status, errors } = validateFields({ name, email, password })

  //verificando se algum dado foi enviado de maneira incorreta
  if (!status) return res.status(406).json({ status: 406, error: errors })

  try {
    //editando usuário
    let { status, error } = await updateUser(name, email, password)

    //veririficando se houve algum erro na edição do osuário
    if (status != 200) return res.status(status).json(status, error)

    return res.json({ status: 200 })
  } catch (error) {
    console.log(error.message)

    return res
      .status(500)
      .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
  }
}

export async function remove(req, res) {
  let { id } = req.params
  let { status, errors } = validateFields({ id })

  //verificando se o id foi enviado de maneira incorreta
  if (!status) return res.status(406).json({ status: 406, error: errors })

  try {
    // removendo usuário
    let { status } = await removeUser(id)

    //verificando se houve algum erro na remoção do usuário
    if (!status)
      return res
        .status(500)
        .json({ status: 500, error: [{ internalError: 'Erro interno' }] })

    return res.json({ status: 200 })
  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ status: 500, error: [{ internalError: 'Erro interno' }] })
  }
}
