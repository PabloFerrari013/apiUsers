// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      database: 'crud',
      user: 'root',
      password: 'ventiladOr',
      host: 'localhost'
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'migrations'
    }
  }
}
