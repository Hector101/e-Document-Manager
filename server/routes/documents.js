import documentsController from '../controllers/documents';
import authorization from '../helpers/authorization';


export default (router) => {
  router.post('/api/v1/documents', authorization.verifyUser, documentsController.create);

  router.get('/api/v1/documents', authorization.verifyUser, authorization.verifySuperAndAdmin, documentsController.getAllDocument);
  router.get('/api/v1/documents/:id', authorization.verifyUser, documentsController.getDocument);
  router.get('/api/v1/search/documents', authorization.verifyUser, documentsController.getAllDocument);

  router.put('/api/v1/documents/:id', authorization.verifyUser, documentsController.updateDocument);

  router.delete('/api/v1/documents/:id', authorization.verifyUser, documentsController.deleteDocument);
};
