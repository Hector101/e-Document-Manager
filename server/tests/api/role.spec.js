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

describe('Roles', () => {
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

  describe('POST /api/v1/roles route', () => {
    it(`should expect a role "writer" to be created,
     when super admin wants to create a role`, (done) => {
      chai
        .request(server)
        .post('/api/v1/roles')
        .set({ authorization: superAdminToken })
        .send(writerRole)
        .end((err, res) => {
          expect(res.status).toBe(201);
          expect(res.body.name).toBe('writer');
          done();
        });
    });

    it(`should expect respond with status code 409 
      and message "Role name already exist",
       when super admin wants to create a role
      and role already exist in database`, (done) => {
      chai
        .request(server)
        .post('/api/v1/roles')
        .set({ authorization: superAdminToken })
        .send(superadminRole)
        .end((err, res) => {
          expect(res.status).toBe(409);
          expect(res.body.message).toEqual('Role name already exist');
          done();
        });
    });
  });

  describe('GET /api/v1/roles', () => {
    it(`should expect to get all roles in database and
     respond with a 200 status when super admin
      wants to get all role in database`, (done) => {
      chai
        .request(server)
        .get('/api/v1/roles')
        .set({ authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.message[0].name).toEqual('superadmin');
          expect(res.body.message[1].name).toEqual('admin');
          expect(res.body.message[2].name).toEqual('user');
          done();
        });
    });
  });

  describe('GET /api/v1/roles/:id', () => {
    it(`should get role name (superadmin) with id "1"
     in database and respond with a 200 status`, (done) => {
      chai
        .request(server)
        .get('/api/v1/roles/1')
        .set({ authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toEqual('superadmin');
          done();
        });
    });

    it(`should respond with status 404 and message "Role not found",
     when super admin wants to get role name 
     with id that does not exist`, (done) => {
      chai
        .request(server)
        .get('/api/v1/roles/6')
        .set({ authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).toBe(404);
          expect(res.body.message).toEqual('Role not found');
          done();
        });
    });

    it(`should respond with status 400 and message "Invalid id",
     when super admin wants to get role name 
     but role id is invalid`, (done) => {
      chai
        .request(server)
        .get('/api/v1/roles/dhf')
        .set({ authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid id');
          done();
        });
    });
  });

  describe('PUT /api/v1/roles/:id', () => {
    it(`should respond with status 400 and message 
    "Can't update super admin role",
     when super admin wants to update role name 
     of a superadmin`, (done) => {
      chai
        .request(server)
        .put('/api/v1/roles/1')
        .set({ authorization: superAdminToken })
        .send(updateRole)
        .end((err, res) => {
          expect(res.status).toBe(403);
          expect(res.body.message).toEqual("Can't update super admin role");
          done();
        });
    });

    it(`should respond with status 404 and message "Role not found",
     when super admin wants to update role name 
     but role id does not exist in database`, (done) => {
      chai
        .request(server)
        .put('/api/v1/roles/67')
        .set({ authorization: superAdminToken })
        .send(updateRole)
        .end((err, res) => {
          expect(res.status).toBe(404);
          expect(res.body.message).toEqual('Role not found');
          done();
        });
    });

    it(`should respond with status 200 with new role name ,
     when super admin wants to update role name with id "4"`, (done) => {
      chai
        .request(server)
        .put('/api/v1/roles/4')
        .set({ authorization: superAdminToken })
        .send(updateRole)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toEqual('reviewer');
          done();
        });
    });

    it(`should respond with status 400 and message "Provide a valid role name",
     when super admin wants to update role name 
     but role name is an invalid like integers`, (done) => {
      chai
        .request(server)
        .put('/api/v1/roles/4')
        .set({ authorization: superAdminToken })
        .send({ name: '7645' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Provide a valid role name');
          done();
        });
    });

    it(`should respond with status 400 and message "Invalid id",
     when super admin wants to update role name 
     but role id is invalid (not an integer)`, (done) => {
      chai
        .request(server)
        .put('/api/v1/roles/nvd')
        .set({ authorization: superAdminToken })
        .send(updateRole)
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid id');
          done();
        });
    });
  });

  describe('DELETE /api/v1/roles/:id', () => {
    it(`should respond with status 403 and message 
    "Can't delete superadmin role",
     when super admin wants to delete role name of superadmin`, (done) => {
      chai
        .request(server)
        .delete('/api/v1/roles/1')
        .set({ authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).toBe(403);
          expect(res.body.message).toEqual("Can't delete superadmin role");
          done();
        });
    });

    it(`should respond with status 404 and message "Role not found",
     when super admin wants to delete role name 
     but role id does not exist in database`, (done) => {
      chai
        .request(server)
        .delete('/api/v1/roles/67')
        .set({ authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).toBe(404);
          expect(res.body.message).toEqual('Role not found');
          done();
        });
    });

    it(`should respond with status 400 and message "Invalid id",
     when super admin wants to delete role name 
     but role id is invalid (not an integer)`, (done) => {
      chai
        .request(server)
        .delete('/api/v1/roles/nvd')
        .set({ authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid id');
          done();
        });
    });
  });
});
