# Node Web Server 

  node app using passport with mysql and redis

copy local config sample file `config/local.settings.sample.js` to `config/local.settings.js`
edit and add correct config for mysql db

Run the following:
```
$ npm install
$ npm install -g webpack
$ webpack --config webpack.config.js -p
$ node server.js
```

Notes
-------
- need to have a redis server running at `redis://localhost:6379`
- setup mysql db: use schema in `database/devboxdb.sql`
- create new user: `node bin/createUser`


