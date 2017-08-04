import chai from 'chai';
import expect from 'expect';
import chaiHttp from 'chai-http';
import models from '../../models';
import fakeUsers from '../__mock__/fakeUsers';
import server from '../../server';


chai.use(chaiHttp);

const { newUser, existingUser, superAdminLoginDetail,
  adminLoginDetail, regularUserDetail, anotherRegularUserDetail, wrongLoginDetail,
  invalidLoginDetail } = fakeUsers;

let superAdminToken, adminToken, regularUserToken;

describe('User', () => {
  after((done) => {
    models.User.destroy({ where: { id: { $notIn: [1, 2, 3, 4, 5, 6, 7, 8] } } });
    done();
  });

  describe('POST /api/v1/users/login', () => {
    it('should login admin with status code 200, token and profile details', (done) => {
      chai.request(server)
      .post('/api/v1/users/login')
      .send(superAdminLoginDetail)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toIncludeKeys(['tokenLogin', 'userDetailsLogin']);
        done();
      });
    });

    it('should not login blocked user', (done) => {
      chai.request(server)
      .post('/api/v1/users/login')
      .send(regularUserDetail)
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toEqual('Access denied, blocked');
        done();
      });
    });

    it('should login not login user with incorrect password', (done) => {
      chai.request(server)
      .post('/api/v1/users/login')
      .send(wrongLoginDetail)
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.message).toEqual('Password incorrect');
        done();
      });
    });

    it('should throw an error if invalid input is provided', (done) => {
      chai.request(server)
      .post('/api/v1/users/login')
      .send(invalidLoginDetail)
      .end((err, res) => {
        expect(res.status).toBe(500);
        expect(res.body.message).toEqual('Invalid input field');
        done();
      });
    });

    it('should respond with 401 status if no login field is provided', (done) => {
      chai.request(server)
      .post('/api/v1/users/login')
      .send()
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Provide either username or password');
        done();
      });
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user in database and generate token for user', (done) => {
      chai.request(server)
      .post('/api/v1/users')
      .send(newUser)
      .end((err, res) => {
        expect(res.status).toBe(201);
        expect(res.body).toIncludeKeys(['token', 'userDetails']);
        done();
      });
    });

    it('should throw an error if user already exist in database', (done) => {
      chai.request(server)
      .post('/api/v1/users')
      .send(existingUser)
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.message).toEqual('Account already exists');
        done();
      });
    });
  });

  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(superAdminLoginDetail)
      .end((err, res) => {
        superAdminToken = res.body.tokenLogin;
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(adminLoginDetail)
      .end((err, res) => {
        adminToken = res.body.tokenLogin;
        done();
      });
  });

  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(anotherRegularUserDetail)
      .end((err, res) => {
        regularUserToken = res.body.tokenLogin;
        done();
      });
  });

  describe('GET /api/v1/users', () => {
    it('should authorize only super admin', (done) => {
      chai.request(server)
      .get('/api/v1/users')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.pagination.row).toBeAn('array');
        done();
      });
    });

    it('should not authorize a non admin ', (done) => {
      chai.request(server)
      .get('/api/v1/users')
      .set({ authorization: regularUserToken })
      .end((err, res) => {
        expect(res.status).toBe(403);
        done();
      });
    });

    it('should not authorize an invalid token', (done) => {
      chai.request(server)
      .get('/api/v1/users')
      .set({ authorization: 'jhsdgfgsgdhghdshg987ywedssd7sdgdhs' })
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toEqual('Authentication failed, invalid token');
        done();
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should authorize superadmin and respond with user object', (done) => {
      chai.request(server)
      .get('/api/v1/users/2')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.user).toBeAn('object');
        done();
      });
    });

    it('should authorize superadmin and respond with 404 for user not found in database', (done) => {
      chai.request(server)
      .get('/api/v1/users/87')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual('User not found');
        done();
      });
    });

    it('should authorize superadmin and throw error on invalid query key', (done) => {
      chai.request(server)
      .get('/api/v1/users/h')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Invalid user details provided');
        done();
      });
    });
  });

  describe('POST /api/v1/users/role', () => {
    it('should authorize user with status 200 and user roleId to be 3', (done) => {
      chai.request(server)
      .post('/api/v1/users/role')
      .send({ token: regularUserToken, search: 'johndoe' })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toEqual('user');
        done();
      });
    });

    it('should authorize user and throw error on invalid query key', (done) => {
      chai.request(server)
      .get('/api/v1/users/role')
      .send({ token: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Invalid user details provided');
        done();
      });
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update super admin lastName to "Mario"', (done) => {
      chai.request(server)
      .put('/api/v1/users/1')
      .set({ authorization: superAdminToken })
      .send({ lastName: 'Mario' })
      .end((err, res) => {
        expect(res.body.user.lastName).toEqual('Mario');
        done();
      });
    });

    it('should update user roleId to 2 by only super admin"', (done) => {
      chai.request(server)
      .put('/api/v1/users/5')
      .set({ authorization: superAdminToken })
      .send({ roleId: 2 })
      .end((err, res) => {
        expect(res.body.user.roleId).toEqual(2);
        done();
      });
    });

    it('should not permit an admin to block super admin with status code 403', (done) => {
      chai.request(server)
      .put('/api/v1/users/1')
      .set({ authorization: adminToken })
      .send({ blocked: true })
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toEqual('Not permitted to perform this action');
        done();
      });
    });

    it('should update user block status to true', (done) => {
      chai.request(server)
      .put('/api/v1/users/6')
      .set({ authorization: adminToken })
      .send({ blocked: true })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.user.blocked).toBe(true);
        done();
      });
    });

    it('should throw an error if invalid user id provided', (done) => {
      chai.request(server)
      .put('/api/v1/users/nbb')
      .set({ authorization: adminToken })
      .send({ blocked: true })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
    });

    it('should throw a validation erroe if roleId greater than 5', (done) => {
      chai.request(server)
      .put('/api/v1/users/6')
      .set({ authorization: superAdminToken })
      .send({ roleId: 7 })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
    });

    it('should throw a validation error for invalid "blocked" value', (done) => {
      chai.request(server)
      .put('/api/v1/users/6')
      .set({ authorization: adminToken })
      .send({ blocked: 7548 })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        done();
      });
    });

    it('should throw a validation error if an integer is passed to a field that accepts integer value', (done) => {
      chai.request(server)
      .put('/api/v1/users/6')
      .set({ authorization: regularUserToken })
      .send({ firstName: 32 })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('Invalid input value');
        done();
      });
    });
  });

  describe('GET /api/v1/users/:id/documents', () => {
    it('should respond with user own documents', (done) => {
      chai.request(server)
      .get('/api/v1/users/4/documents')
      .set({ authorization: regularUserToken })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.message[0]).toIncludeKeys(['id', 'title', 'content', 'userId', 'access']);
        done();
      });
    });

    it('should restrict unauthrized users thattries to search others access others document', (done) => {
      chai.request(server)
      .get('/api/v1/users/4/documents')
      .set({ authorization: adminToken })
      .end((err, res) => {
        expect(res.status).toEqual(403);
        expect(res.body.message).toEqual('Access restricted');
        done();
      });
    });
  });

  describe('GET /api/v1/search/users', () => {
    it('should respond with authorized user own documents', (done) => {
      chai.request(server)
      .get('/api/v1/search/users/?q=doe')
      .set({ authorization: adminToken })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        done();
      });
    });

    it('expect query response of "doe" to contain users with "johndoe@gmail.com" and "janedoe@gmail.com"', (done) => {
      chai.request(server)
      .get('/api/v1/search/users/?q=doe')
      .set({ authorization: adminToken })
      .end((err, res) => {
        expect(res.body.users[0].email).toEqual('johndoe@gmail.com');
        expect(res.body.users[1].email).toEqual('janedoe@gmail.com');
        done();
      });
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('expect a 404 status code responds if user to be deleted does not exist', (done) => {
      chai.request(server)
      .delete('/api/v1/users/87')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual('User not found');
        done();
      });
    });

    it('expect a 403 status code if superadmin is being deleted and "can\'remove super user"', (done) => {
      chai.request(server)
      .delete('/api/v1/users/1')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toEqual(403);
        expect(res.body.message).toEqual('can\'remove super user');
        done();
      });
    });

    it('expect a 200 status code if superadmin delete user and "User deleted successfully"', (done) => {
      chai.request(server)
      .delete('/api/v1/users/8')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual('User deleted successfully');
        done();
      });
    });

    it('expect a 400 status code on invalid id query input and response message "Invalid user id provided"', (done) => {
      chai.request(server)
      .delete('/api/v1/users/jhh')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('Invalid user id provided');
        done();
      });
    });
  });
});

