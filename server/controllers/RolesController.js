import models from '../models';
import HandleResponse from '../helpers/HandleResponse';

const RolesController = {
  /**
   * create user roles
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {Object} - created role instance
   */
  create(req, res) {
    return models.Role
      .create({
        name: req.body.name
      })
      .then(role => HandleResponse.getResponse(res, 201, role))
      .catch(err => HandleResponse.handleError(err, 400, res));
  },

  /**
   * get all roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {Object} - all instance of roles
   */
  getRoles(req, res) {
    return models.Role
      .findAll()
      .then(role => HandleResponse.getResponse(res, 200, role))
      .catch(err => HandleResponse.handleError(err, 500, res));
  },

  /**
   * get roles by role id in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {Object} - instance of role
   */
  getRole(req, res) {
    if (isNaN(Number(req.params.id))) {
      return HandleResponse.getResponse(res, 400, 'Invalid role id');
    }
    return models.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return HandleResponse.getResponse(res, 404, 'Role not found');
        }
        return HandleResponse.getResponse(res, 200, role);
      })
      .catch(err => HandleResponse.handleError(err, 500, res));
  },

  /**
   * update roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from serverv
   * @returns {Object} - updated role
   */
  updateRole(req, res) {
    if (isNaN(Number(req.params.id))) {
      return HandleResponse.getResponse(res, 400, 'Invalid role id');
    }

    if (req.params.id === '1') {
      return HandleResponse.getResponse(
        res,
        403,
        "Can't update super admin role"
      );
    }
    return models.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) { return HandleResponse.getResponse(res, 404, 'Role not found'); }
        return role
          .update({ name: req.body.name })
          .then(() => HandleResponse.getResponse(res, 200, role))
          .catch(err => HandleResponse.handleError(err, 400, res));
      })
      .catch(err => HandleResponse.handleError(err, 500, res));
  },

  /**
   * delete roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {Object} - server response payload
   */
  deleteRole(req, res) {
    if (isNaN(Number(req.params.id))) {
      return HandleResponse.getResponse(res, 400, 'Invalid role id');
    }

    if (req.params.id === '1') {
      return HandleResponse.getResponse(
        res,
        403,
        "Can't delete superadmin role"
      );
    }

    return models.Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) { return HandleResponse.getResponse(res, 404, 'Role not found'); }
        return role
          .destroy()
          .then(() =>
            HandleResponse.getResponse(res, 200, 'Deleted successfully')
          )
          .catch(err => HandleResponse.handleError(err, 400, res));
      })
      .catch(err => HandleResponse.handleError(err, 500, res));
  }
};

export default RolesController;
