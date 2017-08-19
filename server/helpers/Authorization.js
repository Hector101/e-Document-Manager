import jwt from 'jsonwebtoken';
import milliSeconds from 'ms';
import bcrypt from 'bcrypt';
import secret from './getSecret';
import models from '../models';
import HandleResponse from '../helpers/HandleResponse';

/**
 * @description define all authentication related methods
 * @exports Authorization
 */
const Authorization = {
  /**
   * generate jwt token
   * @param {Object} user - user details
   * @returns {String} token
   */
  generateToken(user) {
    return jwt.sign(user, secret, {
      expiresIn: milliSeconds('7 days')
    });
  },

  /**
   * encrypt user password
   * @param {String} password - user password
   * @returns {String} - hashed password
   */
  encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },

  /**
   * verify entered user password with hashed
   * @param {String} password - user password
   * @param {String} hashedPassword = hashed passed
   * @returns {String} - hashed password
   */
  verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  },

  /**
   * verify if user is authenticated
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Function} next - pass control to next middleware
   * @returns {Object} - server response payload
   */
  verifyUser(req, res, next) {
    const token = req.body.token || req.headers.authorization;
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return HandleResponse.getResponse(
            res,
            401,
            'Authentication failed, invalid token'
          );
        }

        models.User
          .findOne({
            include: [{ model: models.Role, attributes: ['name'] }],
            where: {
              username: decoded.username
            }
          })
          .then((user) => {
            if (!user) {
              return HandleResponse.getResponse(
                res,
                401,
                'Account does not exist'
              );
            }
            if (user.isBlocked === true) {
              return HandleResponse.getResponse(
                res,
                403,
                "Access denied, you're blocked"
              );
            }
            if (decoded.roleId === 1) {
              decoded.isSuperAdmin = true;
            } else if (decoded.roleId === 2) {
              decoded.isAdmin = true;
            }
            decoded.role = user.Role.name;
            req.decoded = decoded;
            req.user = user;
            return next();
          })
          .catch(err => HandleResponse.getResponse(res, 500, err));
      });
    } else {
      return HandleResponse.getResponse(
        res,
        401,
        'Authentication failed, token unavailable'
      );
    }
  },

  /**
   * verify if user has admin rights
   * @param {Object} req - request object from client
   * @param {Object} res - response object
   * @param {Function} next - next middleware
   * @returns {Object} - server response payload
   */
  verifySuperAdmin(req, res, next) {
    if (!req.decoded.isSuperAdmin) {
      return HandleResponse.getResponse(
        res,
        403,
        'Not authorized, only super admin allowed'
      );
    }
    return next();
  },

  /**
   * verify if user has admin rights
   * @param {Object} req - request object from client
   * @param {Object} res - response object
   * @param {Function} next - next middleware
   * @returns {Object} - server response payload
   */
  verifySuperAndAdmin(req, res, next) {
    if (req.decoded.isSuperAdmin || req.decoded.isAdmin) {
      return next();
    }
    return HandleResponse.getResponse(
      res,
      403,
      'Not authorized, only admins allowed'
    );
  },

  /**
   * verify if id provided is an integer
   * @param {Object} req - request object from client
   * @param {Object} res - response object
   * @param {Function} next - next middleware function
   *  @returns {Object} - server response payload
   */
  verifyId(req, res, next) {
    if (isNaN(Number(req.params.id))) {
      return HandleResponse.getResponse(res, 400, 'Invalid id');
    }
    return next();
  },

  /**
   * verify if id provided is an integer
   * @param {Object} req - request object from client
   * @param {Object} res - response object
   * @param {Function} next - next middleware function
   *  @returns {Object} - server response payload
   */
  veryfyUserName(req, res, next) {
    if (!isNaN(Number(req.body.username))) {
      return HandleResponse.getResponse(res, 400, 'Username not valid');
    }
    return next();
  }
};

export default Authorization;
