
exports.up = function(knex, Promise) {
    return knex.schema.createTable('probedata', function(table){
        table.increments();
        table.decimal('ph').notNullable();
        table.decimal('ec').notNullable();
        table.decimal('do').notNullable();
        table.decimal('orp').notNullable();
        table.decimal('tempuw').notNullable();
        table.decimal('tempamb').notNullable();
        table.decimal('humidity').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('probedata');
};


