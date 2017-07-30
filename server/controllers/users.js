import models from '../models';
import authorization from '../helpers/authorization';
import handleResponse from '../helpers/handleResponse';
import pagination from '../helpers/pagination';

/**
 * define user controllers
 * @class UsersController
 */
class UsersController {

  /**
   * @description create user account
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @memberof UserControllers
   * @returns {void}
   */
  create(req, res) {
    const userDetails = authorization.userDetails(req.body);
    const hashedPassword = authorization.encryptPassword(req.body.password);

    return models.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    })
      .then((user) => {
        const token = authorization.generateToken({
          id: user.id,
          username: user.username,
          roleId: user.roleId
        });
        userDetails.id = user.id;
        return handleResponse.response(res, 201, { userDetails, token });
      }).catch(err => handleResponse.handleError(err, 401, res, 'creating account failed'));
  }

  /**
   * @description authenticate user account
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @memberof UserControllers
   * @returns {void}
  */
  login(req, res) {
    return req.body.email || req.body.username ? models.User.findOne({
      where: {
        $or: [{
          username: req.body.username,
        }, {
          email: req.body.email
        }]
      }
    })
    .then((user) => {
      if (user.blocked === true) {
        return handleResponse.response(res, 403, 'Access denied, blocked');
      }
      if (!authorization.verifyPassword(req.body.password, user.password)) {
        return handleResponse.response(res, 403, 'Password incorrect');
      }
      const userDetailsLogin = authorization.userDetails(user);
      const tokenLogin = authorization.generateToken({
        id: user.id,
        username: user.username,
        roleId: user.roleId
      });
      userDetailsLogin.id = user.id;
      return handleResponse.response(res, 200, { userDetailsLogin, tokenLogin });
    })
    .catch(err => handleResponse.handleError(err, 403, res, 'Login failed')) : handleResponse.response(res, 401, 'Provide either username or password');
  }

  /**
   * @description get all instance of users
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {void}
   * @memberof UserControllers
   */
  getUsers(req, res) {
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    return models.User.findAndCount({
      limit,
      offset,
      attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'blocked', 'roleId'],
    })
    .then(users => handleResponse.response(res, 200, {
      pagination: {
        row: users.rows,
        paginationDetails: pagination(users.count, limit, offset)
      }
    }))
    .catch(err => handleResponse.handleError(err, 403, res));
  }

  /**
   * @description get user by id from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {void}
   * @memberof UserControllers
   */
  getUser(req, res) {
    return models.User.findById(req.params.id)
      .then((user) => {
        if (!user) return handleResponse.response(res, 404, 'User not found');
        return handleResponse.response(res, 200, { user: authorization.userDetails(user) });
      })
      .catch(err => handleResponse.handleError(err, 403, res, 'User not found in database'));
  }

  /**
   * @description get user document
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {void}
   * @memberof UserControllers
   */
  getUserRole(req, res) {
    const searchKey = req.body.search;
    models.User.findOne({
      attributes: ['roleId'],
      where: {
        $or: [
          {
            username: {
              $iLike: searchKey
            }
          },
          {
            email: {
              $iLike: searchKey
            }
          }
        ]
      }
    })
    .then(users => handleResponse.response(res, 200, { users }))
    .catch(err => handleResponse.handleError(err, 403, res, 'User does not exist'));
  }

  /**
   * @description update user details
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {void}
   * @memberof UserControllers
   */
  updateUser(req, res) {
    const loggedInUserRole = res.locals.decoded.roleId;
    return models.User.findById(req.params.id)
        .then((users) => {
          if (users.roleId === loggedInUserRole && loggedInUserRole === 1) {
            return users.update(req.body, { fields: ['firstName', 'lastName', 'username', 'email', 'password'] })
              .then(user => handleResponse.response(res, 200, { user }))
              .catch(err => handleResponse.handleError(err, 403, res, 'Update failed'));
          } else if (users.roleId !== loggedInUserRole && loggedInUserRole === 1 && req.body.roleId) {
            return users.update(req.body, { fields: ['roleId', 'blocked'] })
              .then(user => handleResponse.response(res, 200, { user }))
              .catch(err => handleResponse.handleError(err, 403, res, 'User role update failed'));
          } else if (users.roleId !== loggedInUserRole && loggedInUserRole === 2 && req.body.blocked) {
            if (users.roleId === 1) {
              return handleResponse.response(res, 403, 'Not permitted to block super user');
            }
            return users.update(req.body, { fields: ['blocked'] })
              .then(user => handleResponse.response(res, 200, { user }))
              .catch(err => handleResponse.handleError(err, 403, res, 'User role update failed'));
          } else if (users.roleId === loggedInUserRole && loggedInUserRole !== 1) {
            return users.update(req.body, { fields: ['firstName', 'lastName', 'username', 'email', 'password'] })
              .then(user => handleResponse.response(res, 200, { user }))
              .catch(err => handleResponse.handleError(err, 403, res, 'Update failed'));
          }
        })
        .catch(err => handleResponse.handleError(err, 403, res, 'User does not exist'));
  }

  /**
   * @description get user document
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {void}
   * @memberof UserControllers
   */
  getUserDocuments(req, res) {
    const loggedInUserId = res.locals.decoded.id;
    const loggedInRoleId = res.locals.decoded.roleId;
    return models.Document.findAll({
      where: { userId: req.params.id },
      include: [{
        model: models.User,
        attributes: ['id'] }],
    })
    .then((documents) => {
      if (loggedInUserId === documents[0].userId || loggedInRoleId === 1) {
        return handleResponse.response(res, 200, documents);
      }
      return handleResponse.response(res, 403, 'Access restricted');
    })
    .catch(error => handleResponse.handleError(error, 403, res));
  }

  /**
   * search user instances in database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @memberof UserControllers
   * @returns {void}
   */
  searchUser(req, res) {
    const searchKey = req.query.q || req.body.search;
    models.User.findAll({
      attributes: ['firstName', 'lastName', 'username', 'email'],
      where: {
        $or: [
          {
            username: {
              $iLike: searchKey
            }
          },
          {
            firstName: {
              $iLike: searchKey
            }
          },
          {
            lastName: {
              $iLike: searchKey
            }
          },
          {
            email: {
              $iLike: searchKey
            }
          }
        ]
      }
    })
    .then(users => handleResponse.response(res, 200, { users }))
    .catch(err => handleResponse.handleError(err, 403, res, 'User does not exist'));
  }

  /**
   * delete user from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @memberof UserControllers
   * @returns {void}
   */
  deleteUser(req, res) {
    return models.User.findById(req.params.id)
      .then((users) => {
        if (!users) return handleResponse.response(res, 404, 'User not found');
        if (users.roleId === 1) return handleResponse.response(res, 403, 'can\'remove super user');
        return users.destroy()
        .then(user => handleResponse.response(res, 200, 'User deleted successfully'))
        .catch(err => handleResponse.handleError(err, 403, res, 'User not deleted successfully'));
      })
      .catch(err => handleResponse.handleError(err, 403, res));
  }
}


export default new UsersController();
