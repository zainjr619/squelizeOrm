module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "leomessi10",
  DB: "employees",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};