export default function (data) {
  let { id, name, email, password, token } = data
  let errors = []

  if (name != null && name.trim() === '') errors.push({ name: 'Nome inválido' })

  if (email != null && email.trim() === '')
    errors.push({ email: 'E-mail inválido' })

  if (password != null && password.trim() === '')
    errors.push({ password: 'Senha inválida' })

  if (id != null && id.trim() === '') errors.push({ id: 'Id inválido' })

  if (token != null && token.trim() === '')
    errors.push({ token: 'token inválido' })

  if (errors.length > 0) return { status: false, errors }
  return { status: true }
}
