require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password','firstName','lastName','dateOfBirth',"address"]);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.patch('/users/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  if(id != req.user._id){
     return res.status(404).send();
  }
  User.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.send({user});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
