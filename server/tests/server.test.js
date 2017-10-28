const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');
const {users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';
    var firstName= 'userTwoFirstName';
    var lastName='userTwoLastName';
    var dateOfBirth='1984-12-11T00:00:00.000Z';
    request(app)
      .post('/users')
      .send({email, password,firstName,lastName,dateOfBirth})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
        expect(res.body.firstName).toBe(firstName);
        expect(res.body.lastName).toBe(lastName);
        expect(res.body.dateOfBirth).toBe(dateOfBirth);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('PATCH /users/:id', () => {
  it('should update the user', (done) => {
    var hexId = users[1]._id.toHexString();
    var firstName= 'userTwoFirstName1';
    var lastName='userTwoLastName1';
    var dateOfBirth='1986-12-12T00:00:00.000Z';
    request(app)
      .patch(`/users/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        firstName: 'userTwoFirstName1',
        lastName: 'userTwoLastName1',
        dateOfBirth:'1986-12-12T00:00:00.000Z'        
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.user.firstName).toBe(firstName);
        expect(res.body.user.lastName).toBe(lastName);
        expect(res.body.user.dateOfBirth).toBe(dateOfBirth);
      })
      .end(done);
  });

  it('should not update the other user details', (done) => {
    var hexId = users[0]._id.toHexString();
    var firstName= 'userTwoFirstName1';
    var lastName='userTwoLastName1';
    var dateOfBirth='1986-12-12T00:00:00.000Z';
    request(app)
      .patch(`/users/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        firstName: 'userTwoFirstName',
        lastName: 'userTwoLastName',
        dateOfBirth:'1986-12-12' 
      })
      .expect(404)
      .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
