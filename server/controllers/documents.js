import models from '../models';
import handleResponse from '../helpers/handleResponse';
import pagination from '../helpers/pagination';


/**
 * define documents controller
 * @class DocumentsController
 */
class DocumentsController {

  /**
   * @description create document
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @memberof DocumentsController
   * @returns {void}
   */
  create(req, res) {
    const authenticadUser = res.locals.decoded;
    return models.Document.create({
      title: req.body.title,
      content: req.body.content,
      access: req.body.access,
      userId: authenticadUser.id
    })
    .then(document => handleResponse.response(res, 200, { document }))
    .catch(err => handleResponse.handleError(err, 400, res, 'Validation Error, Invalid input value'));
  }

  /**
   * @description get all instance of documents
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {void}
   * @memberof DocumentsController
   */
  getAllDocument(req, res) {
    return models.Document.findAndCount({
      limit: req.query.limit || 20,
      offset: req.query.offset || 0,
    })
    .then(documents => handleResponse.response(res, 200, {
      pagination: {
        row: documents.rows,
        paginationDetails: pagination(documents.count, req.query.limit, req.query.offset)
      }
    }))
    .catch(err => handleResponse.handleError(err, 403, res));
  }

  /**
   * @description get document by id from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {void}
   * @memberof DocumentsController
   */
  getDocument(req, res) {
    const loggedInUserId = res.locals.decoded.id;
    return models.User.findById(req.params.id)
      .then((document) => {
        if (!document) return handleResponse.response(res, 404, 'Document not found');
        if (loggedInUserId === document.userId) {
          return handleResponse.response(res, 200, document);
        }
        return handleResponse.response(res, 403, 'Not allowed');
      })
      .catch(err => handleResponse.handleError(err, 400, res, 'Invadid document ID'));
  }

  /**
   * search documents instances in database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @memberof DocumentsController
   * @returns {void}
   */
  searchDocument(req, res) {
    const searchKey = `%${req.query.q}%`;
    const authenticatedRoleId = res.locals.decoded.roleId;
    const userId = res.locals.decoded.id;
    const searchAttributes = authenticatedRoleId === 1 ? {
      $or: [{ title: { $iLike: searchKey } }]
    }
    :
    {
      $or: [{ access: { $or: ['public', 'role'] } }, { userId }],
      title: { $iLike: searchKey }
    };
    return models.Document.findAll({
      attributes: ['title', 'content', 'access', 'userId', 'createdAt', 'updatedAt'],
      where: searchAttributes,
      include: [
        {
          model: models.User,
          attributes: ['roleId']
        }
      ]
    })
    .then((documents) => {
      const filteredDocuments = documents.filter(document => !(document.User.roleId === authenticatedRoleId && document.roleId === 'role'));
      return handleResponse.response(res, 200, { documents: filteredDocuments });
    })
    .catch(err => handleResponse.handleError(err, 403, res));
  }


  /**
   * @description update document details
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @returns {void}
   * @memberof DocumentsController
   */
  updateDocument(req, res) {
    const loggedInUserId = res.locals.decoded.id;
    return models.Document.findById(req.params.id)
    .then((documents) => {
      if (!documents) return handleResponse.response(res, 404, 'Document not found');
      if (loggedInUserId !== documents.userId) {
        return handleResponse.response(res, 403, 'Update not allowed');
      }
      return documents.update(req.body, { fields: ['title', 'content', 'access'] })
          .then(document => handleResponse.response(res, 200, { document }))
          .catch(err => handleResponse.handleError(err, 403, res));
    })
    .catch(err => handleResponse.handleError(err, 400, res, 'Invalid document ID'));
  }

  /**
   * delete user document from database
   * @param {Object} req - request object from client
   * @param {Object} res - response object from server
   * @memberof DocumentsController
   * @returns {void}
   */
  deleteDocument(req, res) {
    const loggedInUserId = res.locals.decoded.id;
    return models.Document.findById(req.params.id)
      .then((document) => {
        if (!document) return handleResponse.response(res, 404, 'Document not found');
        if (loggedInUserId !== document.userId) {
          return handleResponse.response(res, 403, 'Operation not allowed');
        }
        return document.destroy()
        .then(doc => handleResponse.response(res, 200, 'Document deleted successfully'))
        .catch(err => handleResponse.handleError(err, 403, res, 'Document not deleted successfully'));
      })
      .catch(err => handleResponse.handleError(err, 400, res, 'Invalid document id provided'));
  }
}

export default new DocumentsController();
