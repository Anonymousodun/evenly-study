import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'evenly_study',
      user: 'evenly_user',
      password: 'evenly_password',
    },
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
  },
};

export default config;
