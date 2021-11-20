import dotenv from 'dotenv'
dotenv.config()

import knex from 'knex'
export default knex({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: process.env.PASS,
    database: 'crud'
  },
  migrations: {
    directory: './src/database/migrations',
    tableName: 'migrations'
  }
})
