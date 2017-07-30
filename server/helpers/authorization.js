import jwt from 'jsonwebtoken';
import milliSeconds from 'ms';
import bcrypt from 'bcrypt';
import secret from './getSecret';
import models from '../models';
import handleResponse from '../helpers/handleResponse';


/**
 * @description define all authentication related methods
 * @exports Authorization
 * @class Authorization
 */
class Authorization {

  /**
   * generate jwt token
   * @param {Object} user - user details
   * @memberof Authorization
   * @returns {String} token
   */
  generateToken(user) {
    return jwt.sign(user, secret, {
      expiresIn: milliSeconds('7 days'),
    });
  }

  /**
   * encrypt user password
   * @param {String} password - user password
   * @returns {String} - hashed password
   * @memberof Authorization
   */
  encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * verify entered user password with hashed
   * @param {String} password - user password
   * @param {String} hashedPassword = hashed passed
   * @returns {String} - hashed password
   * @memberof Authorization
   */
  verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  /**
   * collect user details
   * @param {Object} requestBody - request body object
   * @returns {Object} user details
   * @memberof Authorization
   */
  userDetails(requestBody) {
    return {
      id: requestBody.id,
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      username: requestBody.username,
      email: requestBody.email,
      blocked: requestBody.blocked,
      roleId: requestBody.roleId || 3,
      createdAt: requestBody.createdAt,
      updatedAt: requestBody.updatedAt
    };
  }

  /**
   * verify if user is authenticated
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @param {Function} next - pass control to next middleware
   * @memberof Authorization
   * @returns {void}
   */
  verifyUser(req, res, next) {
    const token = req.body.token || req.headers.authorization;

    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return handleResponse.response(res, 403, 'Authentication failed, invalid token');
        }
        
        models.User.findOne({
          where: {
            username: decoded.username
          }
        })
          .then((user) => {
            if (user && user.blocked === true) return handleResponse.response(res, 403, 'Access denied, blocked');
          });
        res.locals.decoded = decoded;
        next();
      });
    } else {
      return res.status(403).send({ message: 'Authentication failed, token unavailable' });
    }
  }

  /**
   * verify if user has admin rights
   * @param {Object} req - request object from client
   * @param {Object} res - response object
   * @param {Function} next - next middleware
   * @returns {void}
   * @memberof Authorization
   */
  verifySuperAdmin(req, res, next) {
    const adminRoleId = res.locals.decoded.roleId;
    if (adminRoleId !== 1) {
      return res.status(403).send({ message: 'Authorization failed, only super admin allowed' });
    }
    next();
  }

  /**
   * verify if user has admin rights
   * @param {Object} req - request object from client
   * @param {Object} res - response object
   * @param {Function} next - next middleware
   * @returns {void}
   * @memberof Authorization
   */
  verifySuperAndAdmin(req, res, next) {
    const adminRoleId = res.locals.decoded.roleId;
    if (adminRoleId === 1 || adminRoleId === 2) {
      return next();
    }
    return res.status(403).send({ message: 'Authorization failed, only admins allowed' });
  }
}

export default new Authorization();
