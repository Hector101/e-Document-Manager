import authorization from '../helpers/authorization';
import roleController from '../controllers/roles';

export default (router) => {
  router.post('/api/v1/roles', authorization.verifyUser, authorization.verifySuperAdmin, roleController.create);

  router.get('/api/v1/roles', authorization.verifyUser, authorization.verifySuperAdmin, roleController.getRoles);
  router.get('/api/v1/roles/:id', authorization.verifyUser, authorization.verifySuperAdmin, roleController.getRole);

  router.put('/api/v1/roles/:id', authorization.verifyUser, authorization.verifySuperAdmin, roleController.updateRole);

  router.delete('/api/v1/roles/:id', authorization.verifyUser, authorization.verifySuperAdmin, roleController.deleteRole);
};
