import models from '../models';
import authorization from '../helpers/authorization';
import handleResponse from '../helpers/handleResponse';
import pagination from '../helpers/pagination';


const UsersController = {

  /**
   * @description create user account
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - created user object
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
      }).catch(err => handleResponse.handleError(err, 400, res, 'User already exists'));
  },

  /**
   * @description authenticate user account
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user details
  */
  login(req, res) {
    if (!(req.body.email || req.body.username)) {
      return handleResponse.response(res, 401, 'Provide either username or password');
    }
    return models.User.findOne({
      include: [{ model: models.Role, attributes: ['name'] }],
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
        return handleResponse.response(res, 401, 'Password incorrect');
      }
      const userDetailsLogin = authorization.userDetails(user);
      const token = authorization.generateToken({
        id: user.id,
        username: user.username,
        roleId: user.roleId
      });
      userDetailsLogin.id = user.id;
      return handleResponse.response(res, 200, { user: userDetailsLogin, token });
    })
    .catch(err => handleResponse.handleError(err, 401, res, 'Authentication failed'));
  },

  /**
   * @description get all instance of users
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user details
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
    .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
  },

  /**
   * @description get user by id from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user object
   */
  getUser(req, res) {
    return models.User.findById(req.params.id)
      .then((user) => {
        if (!user) return handleResponse.response(res, 404, 'User not found');
        return handleResponse.response(res, 200, { user: authorization.userDetails(user) });
      })
      .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
  },

  /**
   * @description update user details
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - updated user object
   */
  updateUser(req, res) {
    const loggedInUserId = req.decoded.id;
    return models.User.findOne({
      include: [{ model: models.Role, attributes: ['name'] }],
      where: {
        id: req.params.id,
      },
    })
    .then((user) => {
      let fields = ['firstName', 'lastName', 'username', 'email', 'password'];
      if (user.id !== loggedInUserId && req.decoded.isSuperAdmin) {
        fields = ['roleId', 'blocked'];
      } else if (user.id !== loggedInUserId && req.decoded.isAdmin && user.Role.name !== 'superadmin') {
        fields = ['blocked'];
      } else if (user.id !== loggedInUserId) {
        return handleResponse.response(res, 403, 'Not permitted to perform this action');
      }
      return user.update(req.body, { fields })
      .then(userUpdate => handleResponse.response(res, 200, { user: authorization.userDetails(userUpdate) }))
      .catch(err => handleResponse.handleError(err, 400, res, 'invalid input'));
    })
    .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
  },

  /**
   * @description get user document
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user document object
   */
  getUserDocuments(req, res) {
    const loggedInUserId = req.decoded.id;
    return models.Document.findAll({
      where: { userId: req.params.id },
      include: [{
        model: models.User,
        attributes: ['firstName', 'lastName'] }],
    })
    .then((document) => {
      if (document.length === 0) return handleResponse.response(res, 404, 'User not found');
      if (!(loggedInUserId === req.params.id || req.decoded.isSuperAdmin)) {
        return handleResponse.response(res, 403, { document: authorization.restrictDocument(document) });
      }
      return handleResponse.response(res, 200, { document });
    })
    .catch(error => handleResponse.handleError(error, 500, res, 'Server Error'));
  },

  /**
   * search user instances in database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user document object
   */
  searchUser(req, res) {
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    const searchKey = req.query.q;
    models.User.findAndCount({
      offset,
      limit,
      attributes: ['firstName', 'lastName', 'username', 'email'],
      include: [{ model: models.Role, attributes: ['name'] }],
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
    .then((users) => {
      const paginationDetails = pagination(users.count, limit, offset);
      return handleResponse.response(res, 200, { users: users.rows, pagination: paginationDetails });
    })
    .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
  },

  /**
   * delete user from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - delete response message object
   */
  deleteUser(req, res) {
    return models.User.findById(req.params.id, {
      include: [{ model: models.Role, attributes: ['name'] }],
    })
      .then((user) => {
        if (!user) return handleResponse.response(res, 404, 'User not found');
        if (user.Role.name === 'superadmin') return handleResponse.response(res, 403, 'can\'remove super user');
        return user.destroy()
        .then(() => handleResponse.response(res, 200, 'User deleted successfully'))
        .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
      })
      .catch(err => handleResponse.handleError(err, 400, res, 'Invalid input'));
  },
  /**
  * Logout a user
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Object} response object
  */
  logout(req, res) {
    return res.status(200).send({
      message: 'Logout successful'
    });
  }
};


export default UsersController;
