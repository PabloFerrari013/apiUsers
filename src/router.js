import express from 'express'
import { loginUser } from './controllers/AuthController'
import { changePassword, recover } from './controllers/TokenController'
const router = express.Router()
import {
  create,
  findAll,
  findOne,
  remove,
  update
} from './controllers/UserController'

router.post('/new', create)
router.get('/users', findAll)
router.get('/user/:id', findOne)
router.put('/user', update)
router.delete('/user/:id', remove)
router.post('/recover', recover)
router.post('/change', changePassword)
router.post('/login', loginUser)
router.get('/token/:token')
export { router }
