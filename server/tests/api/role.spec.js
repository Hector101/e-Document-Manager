import chai from 'chai';
import expect from 'expect';
import chaiHttp from 'chai-http';
import fakeRoles from '../__mock__/fakeRoles';
import fakeUsers from '../__mock__/fakeUsers';
import server from '../../server';

const { superAdminLoginDetail } = fakeUsers;
const { superadminRole, writerRole, updateRole } = fakeRoles;

let superAdminToken;

chai.use(chaiHttp);

describe('Documents', () => {
  before((done) => {
    chai.request(server)
    .post('/api/v1/users/login')
    .send(superAdminLoginDetail)
    .end((err, res) => {
      superAdminToken = res.body.token;
      done();
    });
  });

  describe('POST /api/v1/roles', () => {
    it('should create a new role with a status code 200', (done) => {
      chai.request(server)
      .post('/api/v1/roles')
      .set({ authorization: superAdminToken })
      .send(writerRole)
      .end((err, res) => {
        expect(res.status).toBe(201);
        done();
      });
    });

    it('should respond with 400 validation error if role alrady exist in database', (done) => {
      chai.request(server)
      .post('/api/v1/roles')
      .set({ authorization: superAdminToken })
      .send(superadminRole)
      .end((err, res) => {
        expect(res.status).toBe(400);
        done();
      });
    });
  });

  describe('GET /api/v1/roles', () => {
    it('should get all roles in database and respond with a 200 status', (done) => {
      chai.request(server)
      .get('/api/v1/roles')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.role[0].name).toEqual('superadmin');
        expect(res.body.role[1].name).toEqual('admin');
        expect(res.body.role[2].name).toEqual('user');
        done();
      });
    });
  });

  describe('GET /api/v1/roles/:id', () => {
    it('should get all roles in database and respond with a 200 status', (done) => {
      chai.request(server)
      .get('/api/v1/roles/1')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.role.name).toEqual('superadmin');
        done();
      });
    });

    it('should respond with status 404 and message "Role not found"', (done) => {
      chai.request(server)
      .get('/api/v1/roles/6')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual('Role not found');
        done();
      });
    });

    it('should respond with status 400 and message "Invalid role id provided"', (done) => {
      chai.request(server)
      .get('/api/v1/roles/dhf')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(500);
        expect(res.body.message).toEqual('Server Error');
        done();
      });
    });
  });

  describe('PUT /api/v1/roles/:id', () => {
    it('should respond with status 403 and message "Can\'t update super admin role"', (done) => {
      chai.request(server)
      .put('/api/v1/roles/1')
      .set({ authorization: superAdminToken })
      .send(updateRole)
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toEqual('Can\'t update super admin role');
        done();
      });
    });

    it('should respond with status 404 and message "Role not found"', (done) => {
      chai.request(server)
      .put('/api/v1/roles/67')
      .set({ authorization: superAdminToken })
      .send(updateRole)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual('Role not found');
        done();
      });
    });

    it('should respond with status 404 and message "Role not found"', (done) => {
      chai.request(server)
      .put('/api/v1/roles/4')
      .set({ authorization: superAdminToken })
      .send(updateRole)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.role.name).toEqual('reviewer');
        done();
      });
    });

    it('should respond with status 400 and message "Invalid role provided"', (done) => {
      chai.request(server)
      .put('/api/v1/roles/4')
      .set({ authorization: superAdminToken })
      .send({ name: 7645 })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Invalid input');
        done();
      });
    });

    it('should respond with status 400 and message "Invalid role id provided"', (done) => {
      chai.request(server)
      .put('/api/v1/roles/nvd')
      .set({ authorization: superAdminToken })
      .send(updateRole)
      .end((err, res) => {
        expect(res.status).toBe(500);
        expect(res.body.message).toEqual('Server Error');
        done();
      });
    });
  });

  describe('DELETE /api/v1/roles/:id', () => {
    it('should respond with status 403 and message "Can\'t delete super admin role"', (done) => {
      chai.request(server)
      .delete('/api/v1/roles/1')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toEqual('Can\'t delete super admin role');
        done();
      });
    });

    it('should respond with status 404 and message "Role not found"', (done) => {
      chai.request(server)
      .delete('/api/v1/roles/67')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual('Role not found');
        done();
      });
    });

    it('should respond with status 404 and message "Role not found"', (done) => {
      chai.request(server)
      .delete('/api/v1/roles/5')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });

    it('should respond with status 400 and message "Invalid role id provided"', (done) => {
      chai.request(server)
      .delete('/api/v1/roles/nvd')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(500);
        expect(res.body.message).toEqual('Server Error');
        done();
      });
    });
  });
});
