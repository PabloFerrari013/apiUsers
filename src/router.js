import express from 'express'
import { loginUser } from './controllers/AuthController'
import { changePassword, recoverEmail } from './controllers/TokenController'
const router = express.Router()
import {
  createUser,
  findAllUsers,
  removeUser,
  updateUser,
  userInfos
} from './controllers/UserController'

router.post('/new', createUser)
router.get('/users', findAllUsers)
router.get('/user/infos', userInfos)
router.put('/user', updateUser)
router.delete('/user/:id', removeUser)

router.get('/token/:token')
router.post('/recover', recoverEmail)
router.post('/change', changePassword)

router.post('/login', loginUser)

export { router }
