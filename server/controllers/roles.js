import models from '../models';
import handleResponse from '../helpers/handleResponse';


const RolesController = {

  /**
   * create user roles
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {Object} - created role instance
   */
  create(req, res) {
    return models.Role.create({
      name: req.body.name
    })
    .then(role => handleResponse.response(res, 201, { role }))
    .catch(err => handleResponse.handleError(err, 400, res, 'Invalid input'));
  },

  /**
   * get all roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {Object} - all instance of roles
   */
  getRoles(req, res) {
    return models.Role.findAll()
    .then(role => handleResponse.response(res, 200, { role }))
    .catch(err => handleResponse.handleError(err, 500, res, 'Server Error'));
  },

  /**
   * get roles by role id in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {Object} - instance of role
   */
  getRole(req, res) {
    return models.Role.findById(req.params.id)
    .then((role) => {
      if (!role) {
        return handleResponse.response(res, 404, 'Role not found');
      }
      return handleResponse.response(res, 200, { role });
    })
    .catch(err => handleResponse.handleError(err, 500, res, 'Server Error'));
  },

  /**
   * update roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from serverv
   * @returns {Object} - updated role
   */
  updateRole(req, res) {
    if (req.params.id === '1') {
      return handleResponse.response(res, 403, 'Can\'t update super admin role');
    }
    return models.Role.findById(req.params.id)
      .then((role) => {
        if (!role) return handleResponse.response(res, 404, 'Role not found');
        return role.update({ name: req.body.name })
          .then(() => handleResponse.response(res, 200, { role }))
          .catch(err => handleResponse.handleError(err, 400, res, 'Invalid input'));
      })
      .catch(err => handleResponse.handleError(err, 500, res, 'Server Error'));
  },

  /**
   * delete roles in database
   * @param {any} req - request object from client
   * @param {any} res - response object from server
   * @returns {Object} - server response payload
   */
  deleteRole(req, res) {
    if (req.params.id === '1') {
      return res.status(403).send({ message: 'Can\'t delete super admin role' });
    }

    return models.Role.findById(req.params.id)
      .then((role) => {
        if (!role) return handleResponse.response(res, 404, 'Role not found');
        return role.destroy()
          .then(() => handleResponse.response(res, 200, 'Deleted successfully'))
          .catch(err => handleResponse.handleError(err, 500, res));
      })
      .catch(err => handleResponse.handleError(err, 500, res, 'Server Error'));
  }
};

export default RolesController;
