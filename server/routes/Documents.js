import DocumentsController from '../controllers/DocumentsController';
import Authorization from '../helpers/Authorization';


export default (router) => {
  router.post('/api/v1/documents', Authorization.verifyUser, DocumentsController.create);

  router.get('/api/v1/documents', Authorization.verifyUser, DocumentsController.getAllDocument);
  router.get('/api/v1/documents/:id', Authorization.verifyUser, DocumentsController.getDocument);
  router.get('/api/v1/search/documents', Authorization.verifyUser, DocumentsController.getAllDocument);

  router.put('/api/v1/documents/:id', Authorization.verifyUser, DocumentsController.updateDocument);

  router.delete('/api/v1/documents/:id', Authorization.verifyUser, DocumentsController.deleteDocument);
};
