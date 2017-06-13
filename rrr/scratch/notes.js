const Users = require('../src/collections/Users')

// clear out db and insert one user and one recipe:
// databases/createdb.sh; node bin/new;
//
// let o = {foo: undefined};
// !_.values(o).some(x => x !== undefined);

const id = [1,2,3]

new Users({id}).findMany()
  .then(users => console.log(users))
  .catch(err => console.log(err))

