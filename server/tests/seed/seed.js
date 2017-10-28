const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'manoj1@example.com',
  firstName: 'userOneFirstName',
  lastName: 'userOneLastName',
  password: 'userOnePass',
  dateOfBirth:'1984-12-11',
  address:[{
    addrType:"Home",
    addrText:"Unit 1,XYZ street, Parramatta, NSW 2150"
  }],
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'manoj2@example.com',
  firstName: 'userTwoFirstName',
  lastName: 'userTwoLastName',
  password: 'userTwoPass',
  dateOfBirth:'1984-12-11',
  address:[{
    addrType:"Office",
    addrText:"Unit 11,PQR street, Parramatta, NSW 2050"
  }],
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {users, populateUsers};
