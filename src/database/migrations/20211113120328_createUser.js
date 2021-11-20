exports.up = async function (knex) {
  return await knex.schema
    .createTable('users', function (table) {
      table.string('id').notNullable()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.timestamps(true, true)
    })
    .createTable('tokens', function (table) {
      table.string('id').notNullable()
      table.string('user_id').notNullable()
      table.string('token').notNullable()
      table.int('used').notNullable()
      table.timestamps(true, true)
    })
}

exports.down = async function (knex) {
  return await knex.schema.dropTable('users')
}
