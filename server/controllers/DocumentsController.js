import models from '../models';
import HandleResponse from '../helpers/HandleResponse';
import pagination from '../helpers/pagination';
import FilterDetails from '../helpers/FilterDetails';

const DocumentsController = {
  /**
   * @description create document
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - craeted document or server error response
   */
  create(req, res) {
    const field = ['title', 'content'].find(element => !req.body[element]);
    if (field) {
      return HandleResponse.getResponse(
        res,
        400,
        `${field.charAt(0).toUpperCase()}${field.slice(1)} Required`
      );
    }
    return models.Document
      .findOrCreate({
        where: {
          title: req.body.title
        },
        defaults: {
          title: req.body.title,
          content: req.body.content,
          access: req.body.access || 'public',
          userId: req.decoded.id
        }
      })
      .spread((document, created) => {
        if (!created) {
          return HandleResponse.getResponse(
            res,
            409,
            'A document with this title already exist'
          );
        }
        return HandleResponse.getResponse(
          res,
          201,
          FilterDetails.scrapeDocument(document)
        );
      })
      .catch(err => HandleResponse.handleError(err, 400, res));
  },

  /**
   * @description get all instance of documents
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - pagination document or server error response
   */
  getAllDocument(req, res) {
    let searchKey = '%%';
    const userId = req.decoded.id;
    const roleId = req.decoded.roleId;

    if (req.query.q) {
      searchKey = `%${req.query.q}%`;
    }
    const searchAttributes = req.decoded.roleId === 1
      ? {
        title: { $iLike: searchKey }
      }
      : {
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
        ],
        title: { $iLike: searchKey }
      };

    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;

    return models.Document
      .findAndCount({
        limit,
        offset,
        attributes: [
          'id',
          'title',
          'content',
          'createdAt',
          'updatedAt'
        ],
        where: searchAttributes,
        include: [
          {
            model: models.User,
            attributes: ['roleId']
          }
        ]
      })
      .then((documents) => {
        if (documents.rows.length === 0) {
          return HandleResponse.getResponse(res, 404, 'No search result');
        }
        return HandleResponse.getResponse(res, 200, {
          documents: documents.rows.map(document =>
            FilterDetails.scrapeDocument(document)
          ),
          paginationDetails: pagination(documents.count, limit, offset)
        });
      })
      .catch(err =>
        HandleResponse.handleError(err, 500, res, 'Server Error Occurred')
      );
  },

  /**
   * @description get document by id from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user document or server error response
   */
  getDocument(req, res) {
    const userId = req.decoded.id;
    const roleId = req.decoded.roleId;
    const options = {
      include: [
        {
          model: models.User,
          attributes: ['roleId']
        }
      ]
    };
    const searchKey = req.decoded.roleId === 1
      ? { id: req.params.id }
      : {
        id: req.params.id,
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
      .findOne(options)
      .then((document) => {
        if (!document) {
          return HandleResponse.getResponse(
            res,
            404,
            'No accessible document not found'
          );
        }
        return HandleResponse.getResponse(
          res,
          200,
          FilterDetails.scrapeDocument(document)
        );
      })
      .catch(err =>
        HandleResponse.handleError(err, 500, res, 'Server Error Occurred')
      );
  },

  /**
 * @description update document details
 * @param {Object} req - request object from client
 * @param {Object} res - response object from server
 * @returns {Object} - updated document or server error response
 */
  updateDocument(req, res) {
    const userId = req.decoded.id;
    return models.Document
      .findById(req.params.id)
      .then((documents) => {
        if (!documents) {
          return HandleResponse.getResponse(res, 404, 'Document not found');
        }
        if (userId !== documents.userId) {
          return HandleResponse.getResponse(
            res,
            403,
            'Not permitted to edit document'
          );
        }
        return documents
          .update(req.body, { fields: ['title', 'content', 'access'] })
          .then(document =>
            HandleResponse.getResponse(
              res,
              200,
              FilterDetails.scrapeDocument(document)
            )
          )
          .catch(err => HandleResponse.handleError(err, 400, res));
      })
      .catch(err =>
        HandleResponse.handleError(err, 500, res, 'Server Error Occurred')
      );
  },

  /**
   * delete user document from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - server response payload
   */
  deleteDocument(req, res) {
    const userId = req.decoded.id;
    return models.Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          return HandleResponse.getResponse(res, 404, 'Document not found');
        }
        if (userId !== document.userId) {
          return HandleResponse.getResponse(
            res,
            403,
            'Not permitted to delete document'
          );
        }
        return document
          .destroy()
          .then(() =>
            HandleResponse.getResponse(
              res,
              200,
              'Document deleted successfully'
            )
          )
          .catch(err =>
            HandleResponse.handleError(
              err,
              400,
              res,
              'Document not deleted successfully'
            )
          );
      })
      .catch(err =>
        HandleResponse.handleError(err, 500, res, 'Server Error Occurred')
      );
  }
};

export default DocumentsController;
