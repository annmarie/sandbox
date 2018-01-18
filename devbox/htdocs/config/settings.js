module.exports = {
  env: "prd",
  random: Math.floor((Math.random() * 10) + 1),
  dbs: {
    sitedb: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      dbname: 'devboxdb'
    },
  }
}
