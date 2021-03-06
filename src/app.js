import express from 'express'
import 'express-async-errors'
import dotenv from 'dotenv'
dotenv.config()
import { router } from './router'

const app = express()
const port = process.env.PORT || 8080 || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router)

app.listen(port, () => console.log('Server Running in: ' + port))
