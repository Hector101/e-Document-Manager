import expect from 'expect';
import models from '../../models';

import fakeRoles from '../__mock__/fakeRoles';


const { chiefEditor } = fakeRoles;

describe('User model', () => {
  describe('#Role.create', () => {
    it('should create a new role, when authenticated as a super admin and all all fields are valid', (done) => {
      models.Role.create(chiefEditor)
      .then((role) => {
        expect(role.dataValues.name).toEqual(chiefEditor.name);
        done();
      })
      .catch();
    });

    it('should throw error if role already exist, when authenticated as a super admin', (done) => {
      models.Role.create(chiefEditor)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('Role already exist');

        done();
      });
    });
  });

  describe('#Role.update', () => {
    it('should update a role by user id, when authenticated as a super admin', (done) => {
      models.Role.findById('4')
        .then((role) => {
          role.update({ name: 'author' })
            .then((roleUpdate) => {
              expect(roleUpdate.dataValues.name).toEqual('author');
              done();
            });
        });
    });
  });

  describe('#Role.destroy', () => {
    it('should delete a user by user id, when authenticated as a super admin', (done) => {
      models.Role.findById('4')
        .then((role) => {
          role.destroy()
            .then((roleUpdate) => {
              expect(roleUpdate[0]).toNotExist();

              done();
            });
        });
    });
  });
});

