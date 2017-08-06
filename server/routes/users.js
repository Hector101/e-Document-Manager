import userController from '../controllers/users';
import authorization from '../helpers/authorization';

/**
 * defines user related routes
 * @param {Object} router - express app placeholder
 * @return {void}
 */
export default (router) => {
  router.post('/api/v1/users/login', userController.login);
  router.post('/api/v1/users', userController.create);

  router.get('/api/v1/users', authorization.verifyUser, authorization.verifySuperAndAdmin, userController.getUsers);
  router.get('/api/v1/users/:id', authorization.verifyUser, userController.getUser);
  router.get('/api/v1/users/:id/documents', authorization.verifyUser, userController.getUserDocuments);
  router.get('/api/v1/search/users', authorization.verifyUser, authorization.verifySuperAndAdmin, userController.searchUser);

  router.put('/api/v1/users/:id', authorization.verifyUser, userController.updateUser);

  router.delete('/api/v1/users/:id', authorization.verifyUser, authorization.verifySuperAdmin, userController.deleteUser);
};
