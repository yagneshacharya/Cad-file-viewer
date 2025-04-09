const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "ep-yellow-credit-a1ibloaa-pooler.ap-southeast-1.aws.neon.tech",
  port: 5432,
  username: "neondb_owner",
  password: 'npg_y59THsJMDFtr',
  database: "neondb",
  synchronize: true,
  entities: [require("./entities/Block")],
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { AppDataSource };
