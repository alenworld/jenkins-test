const config = process.env.NODE_ENV === 'testing'
  ? {
    type: 'postgres',
    host: process.env.TEST_POSTGRESQL_HOST,
    port: Number(process.env.TEST_POSTGRESQL_PORT),
    username: process.env.TEST_POSTGRESQL_ROOT_USER,
    password: process.env.TEST_POSTGRESQL_PASSWORD,
    database: process.env.TEST_POSTGRESQL_DB,
    synchronize: false,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'migrations',
    },
  }
  : {
    type: 'postgres',
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_ROOT_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DB,
    synchronize: false,
    dropSchema: false,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'migrations',
    },
  };

module.exports = config;
