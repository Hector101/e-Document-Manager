import models from '../models';
import handleResponse from '../helpers/handleResponse';
import pagination from '../helpers/pagination';
import authorization from '../helpers/authorization';


const DocumentsController = {

  /**
   * @description create document
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - craeted document or server error response
   */
  create(req, res) {
    // console.log(req.body, req.decoded.id);
    models.Document.create({
      title: req.body.title,
      content: req.body.content,
      access: req.body.access,
      userId: req.decoded.id
    })
    .then(document => handleResponse.response(res, 201, { document }))
    .catch(err => handleResponse.handleError(err, 400, res, 'Document not created, check Input'));
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
    if (req.query.q) {
      searchKey = `%${req.query.q}%`;
    }
    const searchAttributes = req.decoded.isSuperAdmin ?
    ({
      $or: [{ title: { $iLike: searchKey } }]
    }) :
    ({
      $or: [{ access: { $or: ['public', 'role'] } }, { userId }],
      title: { $iLike: searchKey }
    });
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    return models.Document.findAndCount({
      limit,
      offset,
      attributes: ['id', 'title', 'content', 'access', 'userId', 'createdAt', 'updatedAt'],
      where: searchAttributes,
      include: [
        {
          model: models.User,
          attributes: ['roleId']
        }
      ]
    })
    .then((documents) => {
      const filteredDocuments = documents.rows.filter(document => !(document.User.roleId === req.decoded.roleId && document.roleId === 'role'));
      const searchDocument = req.decoded.isSuperAdmin ? documents.rows : filteredDocuments;
      return handleResponse.response(res, 200, {
        pagination: {
          row: searchDocument,
          paginationDetails: pagination(documents.count, limit, offset)
        }
      });
    })
    .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
  },

  /**
   * @description get document by id from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - user document or server error response
   */
  getDocument(req, res) {
    const loggedInUserId = req.decoded.id;
    return models.Document.findById(req.params.id)
      .then((document) => {
        if (!document) return handleResponse.response(res, 404, 'Document not found');
        if (loggedInUserId === document.userId || req.decoded.isSuperAdmin) {
          return handleResponse.response(res, 200, { document });
        }
        return handleResponse.response(res, 403, 'Not allowed');
      })
      .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
  },

/**
 * @description update document details
 * @param {Object} req - request object from client
 * @param {Object} res - response object from server
 * @returns {Object} - updated document or server error response
 */
  updateDocument(req, res) {
    const loggedInUserId = req.decoded.id;
    return models.Document.findById(req.params.id)
    .then((documents) => {
      if (!documents) return handleResponse.response(res, 404, 'Document not found');
      if (loggedInUserId !== documents.userId) {
        return handleResponse.response(res, 403, 'Not permitted to edit document');
      }
      return documents.update(req.body, { fields: ['title', 'content', 'access'] })
        .then(document => handleResponse.response(res, 200, { document }))
        .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
    })
  .catch(err => handleResponse.handleError(err, 400, res, 'Invalid input'));
  },

  /**
   * delete user document from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {Object} - server response payload
   */
  deleteDocument(req, res) {
    const loggedInUserId = req.decoded.id;
    return models.Document.findById(req.params.id)
      .then((document) => {
        if (!document) return handleResponse.response(res, 404, 'Document not found');
        if (loggedInUserId !== document.userId) {
          return handleResponse.response(res, 403, 'Not permitted to delete document');
        }
        return document.destroy()
        .then(() => handleResponse.response(res, 200, 'Document deleted successfully'))
        .catch(err => handleResponse.handleError(err, 500, res, 'Document not deleted successfully'));
      })
      .catch(err => handleResponse.handleError(err, 500, res, 'Server Error Occurred'));
  }
};

export default DocumentsController;
