import expect from 'expect';
import models from '../../models';

import fakeUsers from '../__mock__/fakeUsers';


const { newUser, invalidUser } = fakeUsers;

describe('User model', () => {
  describe('#User.create', () => {
    it('should create a user', (done) => {
      models.User.create(newUser)
      .then((user) => {
        expect(user.dataValues.email).toEqual(newUser.email);
        expect(user.dataValues.username).toEqual(newUser.username);
        done();
      })
      .catch();
    });

    it('should throw error if user already exist', (done) => {
      models.User.create(newUser)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('username must be unique');

        done();
      });
    });

    it('should throw error if invalid username is provided', (done) => {
      models.User.create(invalidUser)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('Validation isAlpha on lastName failed');
        done();
      });
    });
  });

  describe('#User.update', () => {
    it('should update a user by user id', (done) => {
      models.User.findById('11')
        .then((user) => {
          user.update({ firstName: 'Ademola' })
            .then((userUpdate) => {
              expect(userUpdate.dataValues.firstName).toEqual('Ademola');
              done();
            });
        });
    });
  });

  describe('#User.destroy', () => {
    it('should delete a user by user id', (done) => {
      models.User.findById('5')
        .then((user) => {
          user.destroy()
            .then((userUpdate) => {
              expect(userUpdate[0]).toNotExist();

              done();
            });
        });
    });
  });
});

