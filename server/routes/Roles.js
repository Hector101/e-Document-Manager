import Authorization from '../helpers/Authorization';
import RolesController from '../controllers/RolesController';

export default (router) => {
  router.post(
    '/api/v1/roles',
    Authorization.verifyUser,
    Authorization.verifySuperAdmin,
    RolesController.create
  );

  router.get(
    '/api/v1/roles',
    Authorization.verifyUser,
    Authorization.verifySuperAdmin,
    RolesController.getRoles
  );
  router.get(
    '/api/v1/roles/:id',
    Authorization.verifyUser,
    Authorization.verifySuperAdmin,
    Authorization.verifyId,
    RolesController.getRole
  );

  router.put(
    '/api/v1/roles/:id',
    Authorization.verifyUser,
    Authorization.verifySuperAdmin,
    Authorization.verifyId,
    RolesController.updateRole
  );

  router.delete(
    '/api/v1/roles/:id',
    Authorization.verifyUser,
    Authorization.verifySuperAdmin,
    Authorization.verifyId,
    RolesController.deleteRole
  );
};
