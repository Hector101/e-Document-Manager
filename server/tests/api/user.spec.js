import chai from 'chai';
import expect from 'expect';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import models from '../../models';
import fakeUsers from '../__mock__/fakeUsers';
import server from '../../server';

chai.use(chaiHttp);

const {
  newUser,
  existingUser,
  superAdminLoginDetail,
  adminLoginDetail,
  regularUserDetail,
  wrongLoginDetail,
  invalidLoginDetail,
  invalidPassword,
  invalidUsername,
  invalidUser
} = fakeUsers;

let superAdminToken, adminToken;

describe('User', () => {
  before((done) => {
    chai
    .request(server)
    .post('/api/v1/users/login')
    .send(superAdminLoginDetail)
    .end((err, res) => {
      superAdminToken = res.body.token;
      done();
    });
  });
  before((done) => {
    chai
    .request(server)
    .post('/api/v1/users/login')
    .send(adminLoginDetail)
    .end((err, res) => {
      adminToken = res.body.token;
      done();
    });
  });
  after((done) => {
    models.User.destroy({
      where: { id: { $notIn: [1, 2, 3, 4, 5, 6, 7, 8] } }
    });
    done();
  });

  describe('POST /api/v1/users/login route', () => {
    describe(`should login user when correct 
      and valid login detail is provided`, () => {
      it('with status code 200, token and profile details', (done) => {
        chai
          .request(server)
          .post('/api/v1/users/login')
          .send(superAdminLoginDetail)
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body).toIncludeKeys(['user', 'token']);
            expect(res.body.user.firstName).toEqual('Mighty');
            done();
          });
      });
    });
    describe(`should not login blocked user when 
      blocked from using the platform by an admin`, () => {
      it(`with an Unauthorized 403 status
        code and "Access denied, you're blocked"`, (done) => {
        chai
        .request(server)
        .post('/api/v1/users/login')
        .send(regularUserDetail)
        .end((err, res) => {
          expect(res.status).toBe(403);
          expect(res.body.message).toEqual("Access denied, you're blocked");
          done();
        });
      });
    });
    describe('should not login user with incorrect password', () => {
      it(`with 401 status code and
         "Password incorrect" response message`, (done) => {
        chai
        .request(server)
        .post('/api/v1/users/login')
        .send(wrongLoginDetail)
        .end((err, res) => {
          expect(res.status).toBe(401);
          expect(res.body.message).toEqual('Password incorrect');
          done();
        });
      });
    });

    describe('when invalid username is provided', () => {
      it(`should respond with a 404 
        status and message "User does not exist"`, (done) => {
        chai
        .request(server)
        .post('/api/v1/users/login')
        .send(invalidLoginDetail)
        .end((err, res) => {
          expect(res.status).toBe(404);
          expect(res.body.message).toEqual('User does not exist');
          done();
        });
      });
    });

    describe('should not login user when password is incorrect', () => {
      it(`with a status code of 401 and a
         response message of "Password Required"`, (done) => {
        chai
        .request(server)
        .post('/api/v1/users/login')
        .send()
        .end((err, res) => {
          expect(res.status).toBe(401);
          expect(res.body.message).toBe('Password Required');
          done();
        });
      });
    });
  });

  describe('POST /api/v1/users', () => {
    describe(`should create a new user
      when all required field is provided`, () => {
      it(`with a 201 status
         response, user details and token`, (done) => {
        chai
        .request(server)
        .post('/api/v1/users')
        .send(newUser)
        .end((err, res) => {
          expect(res.status).toBe(201);
          expect(res.body).toIncludeKeys([
            'user',
            'token'
          ]);
          expect(res.body.user).toIncludeKeys([
            'id',
            'firstName',
            'lastName',
            'username',
          ]);
          expect(res.body.user.firstName).toEqual('Mary');
          expect(res.body.user.lastName).toEqual('Kay');
          expect(res.body.user.username).toEqual('marykay');
          done();
        });
      });
    });

    describe(`should respond with a 409 response and "User already
       exist" message`, () => {
      it('if user already exist in database', (done) => {
        chai
          .request(server)
          .post('/api/v1/users')
          .send(existingUser)
          .end((err, res) => {
            const message = JSON.parse(res.error.text).message;
            expect(res.status).toBe(409);
            expect(message).toEqual('User already exist');
            done();
          });
      });
    });

    describe(`should respond with a 400 response and "Password
       Required" message`, () => {
      it('when password field is not provided', (done) => {
        chai
          .request(server)
          .post('/api/v1/users')
          .send(invalidPassword)
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Password Required');
            done();
          });
      });
    });

    describe(`should respond with a 400 response and 
      "Username not valid" message`, () => {
      it('when username field is not provided', (done) => {
        chai
          .request(server)
          .post('/api/v1/users')
          .send(invalidUsername)
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Username not valid');
            done();
          });
      });
    });

    describe(`should respond with a 400 response and
      "Last Name Is Invalid"`, () => {
      it('when lastName field is not provided', (done) => {
        chai
          .request(server)
          .post('/api/v1/users')
          .send(invalidUser)
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Last Name Is Invalid');
            done();
          });
      });
    });
  });

  describe('authorized requests', () => {
    describe('GET /api/v1/users routes,', () => {
      describe('when the authenticated user is a super admin', () => {
        it('should get all users in database', (done) => {
          chai
            .request(server)
            .get('/api/v1/users')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toBe(200);
              expect(res.body.users).toBeAn('array');
              expect(res.body.users[1].firstName).toEqual('John');
              expect(res.body.users[1].lastName).toEqual('Doe');
              done();
            });
        });
      });

      describe('when an invalid token is provided', () => {
        it(`should not authorize user
        with a 403 status and "Authentication
         failed, invalid token"`, (done) => {
          chai
            .request(server)
            .get('/api/v1/users')
            .set({ authorization: 'jhsdgfgsgdhghdshg987ywedssd7sdgdhs' })
            .end((err, res) => {
              expect(res.status).toBe(401);
              expect(res.body.message).toEqual(
                'Authentication failed, invalid token'
              );
              done();
            });
        });
      });
    });

    describe('GET /api/v1/users/:id routes,', () => {
      describe(`when user is authenticated,
       and a user id "2" is provided`, () => {
        it(`should expect user firstName
           and lastName to be "John" and "Doe"`, (done) => {
          chai
            .request(server)
            .get('/api/v1/users/2')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toBe(200);
              expect(res.body.firstName).toEqual('John');
              expect(res.body.lastName).toEqual('Doe');
              done();
            });
        });
      });

      describe('when a user id that does not exist is provided', () => {
        it(`should respond with 404 for
           user not found in database and a
             response message "User does not exist"`, (done) => {
          chai
            .request(server)
            .get('/api/v1/users/87')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toBe(404);
              expect(res.body.message).toEqual('User does not exist');
              done();
            });
        });
      });

      describe('when an invalid user id is provided', () => {
        it(`should respond with an error
           message "Invalid id" and a 400 status`, (done) => {
          chai
            .request(server)
            .get('/api/v1/users/h')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toBe(400);
              expect(res.body.message).toEqual('Invalid id');
              done();
            });
        });
      });
    });

    describe('PUT /api/v1/users/:id route,', () => {
      describe(`when user is authenticated,
         and wants to update lastName`, () => {
        it('should update lastName to "Mario"', (done) => {
          chai
            .request(server)
            .put('/api/v1/users/1')
            .set({ authorization: superAdminToken })
            .send({ lastName: 'Mario' })
            .end((err, res) => {
              expect(res.body.lastName).toEqual('Mario');
              done();
            });
        });
      });
      describe(`when authenticated user is an admin,
         and wants to block super admin`, () => {
        it(`should respond with status code 403 and a message
           "Not permitted to perform this action"`, (done) => {
          chai
            .request(server)
            .put('/api/v1/users/1')
            .set({ authorization: adminToken })
            .send({ isBlocked: true })
            .end((err, res) => {
              expect(res.status).toBe(403);
              expect(res.body.message).toEqual(
                'Not permitted to perform this action'
              );
              done();
            });
        });
      });

      describe(`when authenticated user is an admin,
         and wants to block a user with id "6"`, () => {
        it('should successfully update user block status to true', (done) => {
          chai
            .request(server)
            .put('/api/v1/users/6')
            .set({ authorization: adminToken })
            .send({ isBlocked: true })
            .end((err, res) => {
              expect(res.status).toEqual(200);
              done();
            });
        });
      });

      describe('when user id provided is not an integer.', () => {
        it('expect a status 400 and message "Invalid user id"', (done) => {
          chai
            .request(server)
            .put('/api/v1/users/nbb')
            .set({ authorization: adminToken })
            .send({ isBlocked: true })
            .end((err, res) => {
              expect(res.status).toEqual(400);
              expect(res.body.message).toBe('Invalid id');
              done();
            });
        });
      });

      describe(`when user tries to update
         their username with an invalid details.`, () => {
        it('expect a 400 status and a message "Username not valid"', (done) => {
          chai
            .request(server)
            .put('/api/v1/users/3')
            .set({ authorization: adminToken })
            .send({ username: '673547635' })
            .end((err, res) => {
              expect(res.status).toEqual(400);
              expect(res.body.message).toBe('Username not valid');
              done();
            });
        });
      });
    });

    describe('GET /api/v1/users/:id/documents routes', () => {
      describe(`when super admin wants to
         access all documents belonging to a user`, () => {
        it('expect a 200 status and documents belonging to a user', (done) => {
          chai
            .request(server)
            .get('/api/v1/users/4/documents')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toEqual(200);
              expect(res.body.documents[0]).toIncludeKeys([
                'id',
                'title',
                'content',
                'createdAt',
                'updatedAt'
              ]);
              expect(res.body.documents[0].title).toEqual('Just in the creep');
              expect(res.body.documents[1].title).toEqual(
                'My dream date was awesome'
              );
              done();
            });
        });
      });

      describe(`when a user wants to
         access all documents belonging
           to a user id that doesn't exist`, () => {
        it(`expect a 404 status  response and
           a message "No document found"`, (done) => {
          chai
            .request(server)
            .get('/api/v1/users/65/documents')
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).toEqual(404);
              expect(res.body.message).toEqual('No document found');
              done();
            });
        });
      });

      describe('when an authenticated provides an invalid user id', () => {
        it('expect a 400 status and an "invalid id" message', (done) => {
          chai
            .request(server)
            .get('/api/v1/users/df4/documents')
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).toEqual(400);
              expect(res.body.message).toEqual('Invalid id');
              done();
            });
        });
      });
    });

    describe('GET /api/v1/search/users', () => {
      describe(`when the search query parameter is
         "doe", and there's search result`, () => {
        it('expect a 200 status code with the response', (done) => {
          chai
            .request(server)
            .get('/api/v1/search/users/?q=doe')
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).toEqual(200);
              done();
            });
        });
      });

      describe(`when the search query parameter is
         "doe", and there's search result`, () => {
        it(`expect search result to contain users
           with email "johndoe@gmail.com" and "janedoe@gmail.com"`, (done) => {
          chai
            .request(server)
            .get('/api/v1/search/users/?q=doe')
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.body.users[0].username).toEqual('johndoe');
              expect(res.body.users[1].username).toEqual('janedoe');
              done();
            });
        });
      });

      describe(`when the search query parameter is
         "nancy", and there's search result`, () => {
        it(`expect search result to contain 
          username: "nancykate17" and 
            email: "nancykate17@gmail.com"`, (done) => {
          chai
            .request(server)
            .get('/api/v1/search/users/?q=nancy')
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.body.users[0].username).toEqual('nancykate17');
              done();
            });
        });
      });

      describe(`when the search query parameter is
         "mercy", which doesn't exist in the database`, () => {
        it(`expect a 404 status and "No search result found"
           if user does not exist`, (done) => {
          chai
            .request(server)
            .get('/api/v1/search/users/?q=mercy')
            .set({ authorization: adminToken })
            .end((err, res) => {
              expect(res.status).toEqual(404);
              expect(res.body.message).toEqual('No search result found');
              done();
            });
        });
      });
    });

    describe('DELETE /api/v1/users/:id', () => {
      describe('when user id to be deleted does not exist', () => {
        it(`expect a 404 status code responds
           if user to be deleted does not exist`, (done) => {
          chai
            .request(server)
            .delete('/api/v1/users/87')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toEqual(404);
              expect(res.body.message).toEqual('User does not exist');
              done();
            });
        });
      });

      describe(`when the authenticated user a 
        super admin, and wants to delete itself`, () => {
        it(`expect a 403 status code and a response 
          message "Not allowed to remove superadmin"`, (done) => {
          chai
            .request(server)
            .delete('/api/v1/users/1')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toEqual(403);
              expect(res.body.message).toEqual(
                'Not allowed to remove superadmin'
              );
              done();
            });
        });
      });

      describe(`when the authenticated user a 
        super admin, and wants to delete a user from database`, () => {
        it(`expect a 200 status code with a message
           "User deleted successfully"`, (done) => {
          chai
            .request(server)
            .delete('/api/v1/users/8')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toEqual(200);
              expect(res.body.message).toEqual('User deleted successfully');
              done();
            });
        });
      });

      describe('when a super admin provides an invalid user id', () => {
        it('expect a 400 status  and response message "Invalid id"', (done) => {
          chai
            .request(server)
            .delete('/api/v1/users/jhh')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.status).toEqual(400);
              expect(res.body.message).toEqual('Invalid id');
              done();
            });
        });
      });
    });

    describe(' GET /api/v1/users/logout', () => {
      describe('when a user successfully signs out', () => {
        it(`expect a 200 status and a response
           message "Logout successful"`, (done) => {
          chai.request(server).get('/api/v1/users/logout').end((err, res) => {
            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual('Logout successful');
            done();
          });
        });
      });
    });

    describe(`Handle Server Error when it
     occurs with each of these operations`, () => {
      let stubFindOne;
      let stubFindAndCount;
      let stubFinfById;
      let stubUpdate;
      describe('POST /api/v1/users/login', () => {
        beforeEach(() => {
          stubFindOne = sinon
            .stub(models.User, 'findOne')
            .callsFake(() =>
              Promise.reject({ error: 'Server Error Occurred' })
            );
        });
        afterEach(() => {
          stubFindOne.restore();
        });
        it('should catch a server error, on login', (done) => {
          chai
            .request(server)
            .post('/api/v1/users/login')
            .send(superAdminLoginDetail)
            .end((err, res) => {
              expect(res.error.status).toEqual(500);
              expect(JSON.parse(res.error.text).message).toEqual(
                'Server Error Occurred'
              );
              done();
            });
        });
      });

      describe('GET /api/v1/users', () => {
        before((done) => {
          stubFindAndCount = sinon
            .stub(models.User, 'findAndCount')
            .callsFake(() =>
              Promise.reject({ error: 'Server Error Occurred' })
            );
          done();
        });
        after((done) => {
          stubFindAndCount.restore();
          done();
        });
        it('should catch a server error, on get all users', (done) => {
          chai
            .request(server)
            .get('/api/v1/users')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.error.status).toEqual(500);
              expect(JSON.parse(res.error.text).message).toEqual(
                'Server Error Occurred'
              );
              done();
            });
        });

        it('should catch a server error, on search user', (done) => {
          chai
            .request(server)
            .get('/api/v1/search/users')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(JSON.parse(res.error.text).message).toEqual(
                'Server Error Occurred'
              );
              done();
            });
        });
      });

      describe('GET /api/v1/users/:id', () => {
        beforeEach(() => {
          stubFinfById = sinon
            .stub(models.User, 'findById')
            .callsFake(() =>
              Promise.reject({ error: 'Server Error Occurred' })
            );
        });
        afterEach(() => {
          stubFinfById.restore();
        });
        it('should catch a server error, on get all users', (done) => {
          chai
            .request(server)
            .get('/api/v1/users/3')
            .set({ authorization: superAdminToken })
            .end((err, res) => {
              expect(res.error.status).toEqual(500);
              expect(JSON.parse(res.error.text).message).toEqual(
                'Server Error Occurred'
              );
              done();
            });
        });
      });

      describe('PUT /api/v1/users/:id', () => {
        beforeEach(() => {
          stubUpdate = sinon
            .stub(models.User, 'update')
            .callsFake(() =>
              Promise.reject({ error: 'Server Error Occurred' })
            );
        });
        afterEach(() => {
          stubUpdate.restore();
        });
        beforeEach(() => {
          stubFinfById = sinon
            .stub(models.User, 'findById')
            .callsFake(() =>
              Promise.reject({ error: 'Server Error Occurred' })
            );
        });
        afterEach(() => {
          stubFinfById.restore();
        });

        it('should catch a server error, on update user details', (done) => {
          chai
            .request(server)
            .put('/api/v1/users/3')
            .set({ authorization: superAdminToken })
            .send({ roleId: 2 })
            .end((err, res) => {
              expect(res.error.status).toEqual(500);
              expect(JSON.parse(res.error.text).message).toEqual(
                'Server Error Occurred'
              );
              done();
            });
        });
      });
    });
  });
});
