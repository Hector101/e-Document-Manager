import chai from 'chai';
import expect from 'expect';
import chaiHttp from 'chai-http';
import fakeDocuments from '../__mock__/fakeDocuments';
import fakeUsers from '../__mock__/fakeUsers';
import server from '../../server';

const { superAdminLoginDetail, adminLoginDetail, anotherRegularUserDetail } = fakeUsers;
const { privateDocument, roleDocument, invalidFieldDocument, existingDocument } = fakeDocuments;
let superAdminToken, adminToken, regularUserToken;

chai.use(chaiHttp);

describe('Documents', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(superAdminLoginDetail)
      .end((err, res) => {
        superAdminToken = res.body.token;
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(adminLoginDetail)
      .end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });

  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(anotherRegularUserDetail)
      .end((err, res) => {
        regularUserToken = res.body.token;
        done();
      });
  });

  describe('POST /api/v1/documents', () => {
    it('should create a new document with a status code 200', (done) => {
      chai.request(server)
      .post('/api/v1/documents')
      .set({ authorization: regularUserToken })
      .send(privateDocument)
      .end((err, res) => {
        expect(res.status).toBe(201);
        expect(res.body.document.title).toBe('count in countries without clearnce');
        done();
      });
    });

    it('should create a new document with properties "title", "content", "access", "userId"', (done) => {
      chai.request(server)
      .post('/api/v1/documents')
      .set({ authorization: regularUserToken })
      .send(roleDocument)
      .end((err, res) => {
        expect(res.body.document).toIncludeKeys(['title', 'content', 'access', 'userId']);
        done();
      });
    });

    it('should throw a validation error if invalid input is provided', (done) => {
      chai.request(server)
      .post('/api/v1/documents')
      .set({ authorization: regularUserToken })
      .send(invalidFieldDocument)
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Invalid access type provided');
        done();
      });
    });

    it('should respond with the message "Document Title already exist" if document title already exist', (done) => {
      chai.request(server)
      .post('/api/v1/documents')
      .set({ authorization: regularUserToken })
      .send(existingDocument)
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.message).toEqual('Document Title already exist');
        done();
      });
    });
  });

  describe('GET /api/v1/documents', () => {
    it('should get public documents', (done) => {
      chai.request(server)
      .get('/api/v1/documents')
      .set({ authorization: regularUserToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.documents[0].title).toEqual('What is a lord in England?');
        expect(res.body.documents[0].access).toEqual('public');
        done();
      });
    });

    it('should respond with all documents including private documents for a superadmin', (done) => {
      chai.request(server)
      .get('/api/v1/documents')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.documents)).toBe(true);
        expect(res.body.documents[3].title).toEqual('Just in the creep');
        expect(res.body.documents[3].access).toEqual('private');
        done();
      });
    });

    it('should respond with 404 if a document search result is not found', (done) => {
      chai.request(server)
      .get('/api/v1/documents/?q=genetic')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual('No search result');
        done();
      });
    });
  });

  describe('GET /api/v1/documents/:id', () => {
    it('should respond with status code 404, when non existent document id is passed', (done) => {
      chai.request(server)
      .get('/api/v1/documents/65')
      .set({ authorization: adminToken })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual('Document not found');
        done();
      });
    });

    it('should return a validation error if invalid id is provided', (done) => {
      chai.request(server)
      .get('/api/v1/documents/eye')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(500);
        expect(res.body.message).toEqual('Server Error Occurred');
        done();
      });
    });

    it('expect title to equal the title if document with id 7 in database', (done) => {
      chai.request(server)
      .get('/api/v1/documents/7')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.title).toEqual('My dream date was awesome');
        done();
      });
    });
  });

  describe('GET /api/v1/search/documents', () => {
    it('should return a 200 status code', (done) => {
      chai.request(server)
      .get('/api/v1/search/documents/?q=how')
      .set({ authorization: superAdminToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });

    it('should return all documents with title "how" in it', (done) => {
      chai.request(server)
      .get('/api/v1/search/documents/?q=how')
      .set({ authorization: regularUserToken })
      .end((err, res) => {
        expect(res.body.documents[0].title).toEqual('How to eat an elephant');
        expect(res.body.documents[1].title).toEqual('How much does it cost to buy a title');
        done();
      });
    });
  });

  describe('PUT /api/v1/documents/:id', () => {
    it('should respond with error 404 and error message "Document not found"', (done) => {
      chai.request(server)
      .put('/api/v1/documents/23')
      .set({ authorization: regularUserToken })
      .send({ title: 'How to stop global warming' })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual('Document not found');
        done();
      });
    });

    it('should respond with error 403 and error message "Update not allowed" if not user Document', (done) => {
      chai.request(server)
      .put('/api/v1/documents/12')
      .set({ authorization: regularUserToken })
      .send({ title: 'How to stop global warming' })
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toEqual('Not permitted to edit document');
        done();
      });
    });

    it('should respond with 200 status and document updated', (done) => {
      chai.request(server)
      .put('/api/v1/documents/11')
      .set({ authorization: regularUserToken })
      .send({ title: 'How to stop global warming' })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.title).toEqual('How to stop global warming');
        done();
      });
    });

    it('should respond with 400 status and "Invalid input"', (done) => {
      chai.request(server)
      .put('/api/v1/documents/rer')
      .set({ authorization: regularUserToken })
      .send({ title: 'How to stop global warming' })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Invalid document id');
        done();
      });
    });
  });

  describe('DELETE /api/v1/documents/:id', () => {
    it('should respond with error 404 and error message "Document not found"', (done) => {
      chai.request(server)
      .delete('/api/v1/documents/23')
      .set({ authorization: regularUserToken })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual('Document not found');
        done();
      });
    });

    it('should respond with error 403 and error message "Operation not allowed" if not user Document', (done) => {
      chai.request(server)
      .delete('/api/v1/documents/17')
      .set({ authorization: regularUserToken })
      .end((err, res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toEqual('Not permitted to delete document');
        done();
      });
    });

    it('should respond with 200 status and a message "Document deleted successfully"', (done) => {
      chai.request(server)
      .delete('/api/v1/documents/21')
      .set({ authorization: regularUserToken })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toEqual('Document deleted successfully');
        done();
      });
    });

    it('should respond with 403 status and a message "Invalid document id" when invalid id is provided', (done) => {
      chai.request(server)
      .delete('/api/v1/documents/hd')
      .set({ authorization: regularUserToken })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Invalid document id');
        done();
      });
    });
  });
});

