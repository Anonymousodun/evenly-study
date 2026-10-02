import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).unique().notNullable();
    table.string('name', 255);
    table.string('password_hash', 255).notNullable();
    table.time('target_bedtime');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 500).notNullable();
    table.string('type', 50).notNullable();
    table.string('effort', 20).notNullable();
    table.date('due_date').notNullable();
    table.boolean('completed').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('sleep_entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.date('date').notNullable();
    table.time('bedtime').notNullable();
    table.time('wake_time').notNullable();
    table.integer('rest_score').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('daily_checkins', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.date('date').notNullable();
    table.integer('mood_score').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('skipped_breaks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.date('date').notNullable();
    table.integer('count').defaultTo(1);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time');
    table.string('break_length', 20);
    table.boolean('completed').defaultTo(false);
    table.boolean('skipped').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('skipped_breaks');
  await knex.schema.dropTableIfExists('daily_checkins');
  await knex.schema.dropTableIfExists('sleep_entries');
  await knex.schema.dropTableIfExists('tasks');
  await knex.schema.dropTableIfExists('users');
}
