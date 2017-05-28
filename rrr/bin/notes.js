
const Users = require('../src/collections/users')


const id = [1,2,3]

Users.findMany({id})
    .then(users => console.log(users))
    .catch(err => console.log(err))
