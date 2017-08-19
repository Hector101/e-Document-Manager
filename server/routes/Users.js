import UsersController from '../controllers/UsersController';
import Authorization from '../helpers/Authorization';

/**
 * defines user related routes
 * @param {Object} router - express app placeholder
 * @return {void}
 */
export default (router) => {
  router.post('/api/v1/users/login', UsersController.login);
  router.post(
    '/api/v1/users',
    Authorization.veryfyUserName,
    UsersController.create
  );
  router.get('/api/v1/users/logout', UsersController.logout);

  router.get(
    '/api/v1/users',
    Authorization.verifyUser,
    Authorization.verifySuperAndAdmin,
    UsersController.getUsers
  );
  router.get(
    '/api/v1/users/:id',
    Authorization.verifyUser,
    Authorization.verifyId,
    UsersController.getUser
  );
  router.get(
    '/api/v1/users/:id/documents',
    Authorization.verifyUser,
    Authorization.verifyId,
    UsersController.getUserDocuments
  );
  router.get(
    '/api/v1/search/users',
    Authorization.verifyUser,
    UsersController.searchUser
  );

  router.put(
    '/api/v1/users/:id',
    Authorization.verifyUser,
    Authorization.verifyId,
    Authorization.veryfyUserName,
    UsersController.updateUser
  );

  router.delete(
    '/api/v1/users/:id',
    Authorization.verifyUser,
    Authorization.verifySuperAdmin,
    Authorization.verifyId,
    UsersController.deleteUser
  );
};
