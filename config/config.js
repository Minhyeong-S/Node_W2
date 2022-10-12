require("dotenv").config();
const env = process.env;
if (!env.MYSQL_USERNAME) throw new Error("MYSQL_USERNAME is required!!");
if (!env.MYSQL_PASSWORD) throw new Error("MYSQL_PASSWORD is required!!");
if (!env.MYSQL_DATABASE) throw new Error("MYSQL_DATABASE is required!!");
if (!env.MYSQL_HOST) throw new Error("MYSQL_HOST is required!!");

const development = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
};
const test = {
  username: "root",
  password: null,
  database: "database_test",
  host: "127.0.0.1",
  dialect: "mysql",
};
const production = {
  username: "root",
  password: null,
  database: "database_production",
  host: "127.0.0.1",
  dialect: "mysql",
};

module.exports = { development, production, test };
