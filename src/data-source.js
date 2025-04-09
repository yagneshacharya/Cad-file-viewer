const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: `${process.env.DB_PASSWORD}`,
  database: process.env.DB_NAME,
  ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: true,
  entities: [require("./entities/Block")],
});

module.exports = { AppDataSource };
