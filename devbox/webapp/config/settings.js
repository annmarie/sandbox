module.exports = {
  env: "prd",
  random: Math.floor((Math.random() * 10) + 1),
  dbs: {
    sitedb: {
      host: 'hostname',
      user: 'user',
      password: 'password',
      dbname: 'devboxdb'
    },
  }
}
