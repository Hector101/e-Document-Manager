import models from '../models';
import Authorization from '../helpers/Authorization';
import HandleResponse from '../helpers/HandleResponse';
import pagination from '../helpers/pagination';
import FilterDetails from '../helpers/FilterDetails';

const UsersController = {
  /**
   * @description create user account
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - created user object
   */
  create(req, res) {
    const userDetails = FilterDetails.scrapeUserDetail(req.body);
    if (!req.body.password) {
      return HandleResponse.getResponse(res, 400, 'Password Required');
    }
    if (!isNaN(Number(req.body.username))) {
      return HandleResponse.getResponse(res, 400, 'Username not valid');
    }
    const hashedPassword = Authorization.encryptPassword(req.body.password);
    return models.User
      .findOrCreate({
        where: {
          $or: [{ username: req.body.lastName }, { email: req.body.email }]
        },
        defaults: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword
        }
      })
      .spread((user, created) => {
        if (!created) {
          return HandleResponse.getResponse(res, 401, 'User already exist');
        }
        const token = Authorization.generateToken({
          id: user.id,
          username: user.username,
          roleId: user.roleId
        });
        userDetails.id = user.id;
        userDetails.token = token;

        return HandleResponse.getResponse(res, 201, userDetails);
      })
      .catch(err => HandleResponse.handleError(err, 400, res));
  },

  /**
   * @description authenticate user account
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user details
  */
  login(req, res) {
    if (!(req.body.email || req.body.username)) {
      return HandleResponse.getResponse(
        res,
        401,
        'Provide either username or password'
      );
    }
    return models.User
      .findOne({
        include: [{ model: models.Role, attributes: ['name'] }],
        where: {
          $or: [
            {
              username: req.body.username
            },
            {
              email: req.body.email
            }
          ]
        }
      })
      .then((user) => {
        if (!user) {
          return HandleResponse.getResponse(
            res,
            401,
            'Incorrect username or email'
          );
        }
        if (user.isBlocked === true) {
          return HandleResponse.getResponse(res, 403, 'Access denied, blocked');
        }
        if (!Authorization.verifyPassword(req.body.password, user.password)) {
          return HandleResponse.getResponse(res, 401, 'Password incorrect');
        }
        const userDetailsLogin = FilterDetails.scrapeUserDetail(user);
        const token = Authorization.generateToken({
          id: user.id,
          username: user.username,
          roleId: user.roleId
        });
        userDetailsLogin.id = user.id;
        userDetailsLogin.token = token;
        return HandleResponse.getResponse(res, 200, userDetailsLogin);
      })
      .catch(err => HandleResponse.handleError(err, 500, res));
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
    return models.User
      .findAndCount({
        limit,
        offset,
        attributes: [
          'id',
          'firstName',
          'lastName',
          'username',
          'email',
          'isBlocked',
          'roleId'
        ]
      })
      .then(users =>
        HandleResponse.getResponse(res, 200, {
          users: users.rows,
          paginationDetails: pagination(users.count, limit, offset)
        })
      )
      .catch(err => HandleResponse.handleError(err, 500, res));
  },

  /**
   * @description get user by id from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user object
   */
  getUser(req, res) {
    if (isNaN(Number(req.params.id))) {
      return HandleResponse.getResponse(res, 400, 'Invalid user id');
    }
    return models.User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          return HandleResponse.getResponse(res, 404, 'User not found');
        }
        return HandleResponse.getResponse(
          res,
          200,
          FilterDetails.scrapeUserDetail(user)
        );
      })
      .catch(err => HandleResponse.handleError(err, 500, res));
  },

  /**
   * @description update user details
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - updated user object
   */
  updateUser(req, res) {
    if (isNaN(Number(req.params.id))) {
      return HandleResponse.getResponse(res, 400, 'Invalid user id');
    }
    if (!isNaN(Number(req.body.username))) {
      return HandleResponse.getResponse(res, 400, 'Username not valid');
    }
    if (
      (req.decoded.isAdmin || req.decoded.isSuperAdmin) &&
      req.decoded.id.toString() !== req.params.id
    ) {
      return models.User.findById(req.params.id).then((user) => {
        if (req.decoded.isSuperAdmin) {
          return user
            .update(req.body, { fields: ['roleId', 'isBlocked'] })
            .then(updateUser =>
              HandleResponse.getResponse(
                res,
                200,
                FilterDetails.scrapeUserDetail(updateUser)
              ))
            .catch(err => HandleResponse.handleError(err, 400, res));
        }
        if (user.roleId === 1) {
          return HandleResponse.getResponse(
            res,
            403,
            'Not permitted to perform this action'
          );
        }
        return user
          .update(req.body, { fields: ['isBlocked'] })
          .then(updateUser =>
            HandleResponse.getResponse(
              res,
              200,
              FilterDetails.scrapeUserDetail(updateUser)
            )
          )
          .catch(err => HandleResponse.handleError(err, 400, res));
      })
      .catch(err => HandleResponse.handleError(err, 500, res));
    }
    return req.user
      .update(req.body, {
        fields: ['firstName', 'lastName', 'username', 'email', 'password']
      })
      .then(updateUser =>
        HandleResponse.getResponse(
          res,
          200,
          FilterDetails.scrapeUserDetail(updateUser)
        )
      )
      .catch(err => HandleResponse.handleError(err, 400, res));
  },

  /**
   * @description get user document
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user document object
   */
  getUserDocuments(req, res) {
    if (isNaN(Number(req.params.id))) {
      return HandleResponse.getResponse(res, 400, 'Invalid user id');
    }

    const userId = req.decoded.id;
    const roleId = req.decoded.roleId;
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;

    const options = {
      limit,
      offset,
      attributes: [
        'id',
        'title',
        'content',
        'access',
        'userId',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: models.User,
          attributes: ['roleId']
        }
      ]
    };

    const searchKey = req.decoded.isSuperAdmin
      ? { userId: req.params.id }
      : {
        userId: req.params.id,
        $or: [
            { access: 'public' },
          {
            access: 'role',
            $and: {
              '$User.roleId$': roleId
            }
          },
          {
            access: 'private',
            $and: { userId }
          }
        ]
      };

    options.where = searchKey;

    return models.Document
      .findAndCount(options)
      .then((documents) => {
        if (documents.rows.length === 0) {
          return HandleResponse.getResponse(res, 404, 'No document found');
        }
        return HandleResponse.getResponse(res, 200, {
          documents: documents.rows.map(document =>
            FilterDetails.scrapeDocument(document)
          ),
          paginationDetail: pagination(documents.count, limit, offset)
        });
      })
      .catch(err => HandleResponse.handleError(err, 500, res));
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
    models.User
      .findAndCount({
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
        if (users.rows.length === 0) {
          return HandleResponse.getResponse(res, 404, 'No search result found');
        }
        const paginationDetails = pagination(users.count, limit, offset);
        return HandleResponse.getResponse(res, 200, {
          users: users.rows,
          pagination: paginationDetails
        });
      })
      .catch(err =>
        HandleResponse.handleError(err, 500, res)
      );
  },

  /**
   * delete user from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - delete response message object
   */
  deleteUser(req, res) {
    if (isNaN(Number(req.params.id))) {
      return HandleResponse.getResponse(res, 400, 'Invalid user id');
    }
    return models.User
      .findById(req.params.id, {
        include: [{ model: models.Role, attributes: ['name'] }]
      })
      .then((user) => {
        if (!user) {
          return HandleResponse.getResponse(res, 404, 'User not found');
        }
        if (user.Role.name === 'superadmin') {
          return HandleResponse.getResponse(res, 403, 'Not allowed to remove superadmin');
        }
        return user
          .destroy()
          .then(() =>
            HandleResponse.getResponse(res, 200, 'User deleted successfully')
          )
          .catch(err =>
            HandleResponse.handleError(err, 500, res, 'Server Error Occurred')
          );
      })
      .catch(err => HandleResponse.handleError(err, 400, res, 'Invalid input'));
  },
  /**
  * Logout a user
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Object} response object
  */
  logout(req, res) {
    return HandleResponse.getResponse(res, 200, 'Logout successful');
  }
};

export default UsersController;
