import expect from 'expect';
import models from '../../models';

import fakeUsers from '../__mock__/fakeUsers';


const { newUser, invalidUser } = fakeUsers;

describe('User model', () => {
  describe('#User.create', () => {
    it('should create a user, when all required fields are provided and valid', (done) => {
      models.User.create(newUser)
      .then((user) => {
        expect(user.dataValues.email).toEqual(newUser.email);
        expect(user.dataValues.username).toEqual(newUser.username);
        done();
      })
      .catch();
    });

    it(`should throw error if user already exist with response message 
      "User already exist, choose a different username"`, (done) => {
      models.User.create(newUser)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('User already exist, choose a different username');

        done();
      });
    });

    it(`when creating a user account, 
      if all fields is not provided, 
        expect an error message pointing to the missing field`, (done) => {
      models.User.create(invalidUser)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('Last Name Is Invalid');
        done();
      });
    });
  });

  describe('#User.update', () => {
    it('when a user is authenticated and wants to update their firstNAme, expect new first name to be "Ademola"', (done) => {
      models.User.findById('4')
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
    it('should delete a user by user id when authenticated as a super admin', (done) => {
      models.User.findById('10')
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

