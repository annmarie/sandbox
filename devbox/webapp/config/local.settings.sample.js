// add proper db credentials and
// copy this file to local.settings.js

module.exports = {
  env: "dev",

  dbs: {
    sitedb: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      dbname: 'devboxdb'
    },
  }
}
