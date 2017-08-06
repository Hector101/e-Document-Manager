import jwt from 'jsonwebtoken';
import milliSeconds from 'ms';
import bcrypt from 'bcrypt';
import secret from './getSecret';
import models from '../models';
import handleResponse from '../helpers/handleResponse';


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
      expiresIn: milliSeconds('7 days'),
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
   * collect user details
   * @param {Object} requestBody - request body object
   * @returns {Object} user details
   */
  userDetails(requestBody) {
    return {
      id: requestBody.id,
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      username: requestBody.username,
      email: requestBody.email,
      blocked: requestBody.blocked,
      Role: requestBody.Role,
      createdAt: requestBody.createdAt,
      updatedAt: requestBody.updatedAt
    };
  },
  /**
   * collect user details
   * @param {Object} documents - all instance of user documents
   * @returns {Object} user document
   */
  restrictDocument(documents) {
    return documents.map(document => ({
      id: document.id,
      title: document.title,
      user: document.User,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    }));
  },

  /**
   * collect user details
   * @param {Object} requestBody - request body object
   * @returns {Object} user details
   */
  documents(requestBody) {
    return {
      id: requestBody.id,
      title: requestBody.title,
      content: requestBody.content,
      access: requestBody.access,
      createdAt: requestBody.createdAt,
      updatedAt: requestBody.updatedAt
    };
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
          return handleResponse.response(res, 401, 'Authentication failed, invalid token');
        }

        models.User.findOne({
          include: [{ model: models.Role, attributes: ['name'] }],
          where: {
            username: decoded.username
          }
        })
          .then((user) => {
            if (!user) return handleResponse.response(res, 401, 'Account deactivated');
            if (user.blocked === true) return handleResponse.response(res, 403, 'Access denied, blocked');
            if (decoded.roleId === 1) {
              decoded.isSuperAdmin = true;
            } else if (decoded.roleId === 2) {
              decoded.isAdmin = true;
            }
            decoded.role = user.Role.name;
            req.decoded = decoded;
            return next();
          });
      });
    } else {
      return res.status(401).send({ message: 'Authentication failed, token unavailable' });
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
      return handleResponse.response(res, 403, 'Not authorized, only super admin allowed');
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
    return handleResponse.response(res, 403, 'Not authorized, only admins allowed');
  },
};

export default Authorization;
