import models from '../models';
import handleResponse from '../helpers/handleResponse';

/**
 * define roles controller
 * @class RolesController
 */
class RolesController {

  /**
   * create user roles
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {void}
   * @memberof Roles
   */
  create(req, res) {
    return models.Role.create({
      name: req.body.name
    })
    .then(role => handleResponse.response(res, 200, { role }))
    .catch(err => handleResponse.handleError(err, 403, res));
  }

  /**
   * get all roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {void}
   * @memberof Roles
   */
  getRoles(req, res) {
    return models.Role.findAll()
    .then(role => handleResponse.response(res, 200, { role }))
    .catch(err => handleResponse.handleError(err, 403, res));
  }

  /**
   * get roles by role id in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {void}
   * @memberof Roles
   */
  getRole(req, res) {
    return models.Role.findById(req.params.id)
    .then((role) => {
      if (!role) {
        return handleResponse.response(res, 403, 'Role not found');
      }
      return handleResponse.response(res, 200, { role });
    })
    .catch(err => handleResponse.handleError(err, 403, res));
  }

  /**
   * update roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {void}
   * @memberof Roles
   */
  updateRole(req, res) {
    if (req.params.id === '1') {
      return handleResponse.response(res, 403, 'Can\'t update super admin role');
    }
    return models.Role.findById(req.params.id)
      .then((roles) => {
        if (!roles) return handleResponse.response(res, 200, 'Role not found');
        return roles.update({ role: req.body.role })
          .then(role => handleResponse.response(res, 200, { role }))
          .catch(err => handleResponse.handleError(err, 403, res));
      })
      .catch(err => handleResponse.handleError(err, 403, res));
  }

  /**
   * delete roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {void}
   * @memberof Roles
   */
  deleteRole(req, res) {
    if (req.params.id === '1') {
      return res.status(403).send({ message: 'Can\'t delete super admin role' });
    }

    return models.Role.findById(req.params.id)
      .then((roles) => {
        if (!roles) return handleResponse.response(res, 404, 'Role not found');
        return roles.destroy()
          .then(role => handleResponse.response(res, 200, `${roles.role} deleted`))
          .catch(err => handleResponse.handleError(err, res));
      })
      .catch(err => handleResponse.handleError(err, 403, res));
  }
}

export default new RolesController();
