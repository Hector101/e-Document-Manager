import chai from 'chai';
import expect from 'expect';
import chaiHttp from 'chai-http';
import fakeDocuments from '../__mock__/fakeDocuments';
import fakeUsers from '../__mock__/fakeUsers';
import server from '../../server';

const {
  superAdminLoginDetail,
  adminLoginDetail,
  anotherRegularUserDetail
} = fakeUsers;
const {
  privateDocument,
  invalidFieldDocument,
  existingDocument
} = fakeDocuments;
let superAdminToken, adminToken, regularUserToken;

chai.use(chaiHttp);

describe('Documents', () => {
  before((done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send(superAdminLoginDetail)
      .end((err, res) => {
        superAdminToken = res.body.token;
        done();
      });
  });
  before((done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send(adminLoginDetail)
      .end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });

  before((done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send(anotherRegularUserDetail)
      .end((err, res) => {
        regularUserToken = res.body.token;
        done();
      });
  });

  describe('POST /api/v1/documents route', () => {
    describe('when user is authenticated and all document fields (title, content, access) is provided', () => {
      it(`expect to create a new document with a status
         code 201 and document title "count in countries without clearnce" and access of "private"`, (done) => {
        chai
          .request(server)
          .post('/api/v1/documents')
          .set({ authorization: regularUserToken })
          .send(privateDocument)
          .end((err, res) => {
            expect(res.status).toBe(201);
            expect(res.body.title).toBe('count in countries without clearnce');
            done();
          });
      });
    });

    describe('when a user tries to create a document but provive an invalid document access type', () => {
      it('expect a 400 status with a resmonse message "Invalid access type provided"', (done) => {
        chai
          .request(server)
          .post('/api/v1/documents')
          .set({ authorization: regularUserToken })
          .send(invalidFieldDocument)
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Invalid access type provided');
            done();
          });
      });
    });

    describe('when user wants to createb a document with title that already exist', () => {
      it('expect a 409 status with the message "Document Title already exist"', (done) => {
        chai
          .request(server)
          .post('/api/v1/documents')
          .set({ authorization: regularUserToken })
          .send(existingDocument)
          .end((err, res) => {
            expect(res.status).toBe(409);
            expect(res.body.message).toEqual(
              'A document with this title already exist'
            );
            done();
          });
      });
    });
  });

  describe('GET /api/v1/documents', () => {
    describe('when a regular user wants to get all documents they have access to', () => {
      it('expect the first document to have a title "What is a lord in England?" and an access of "Public"', (done) => {
        chai
          .request(server)
          .get('/api/v1/documents')
          .set({ authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.documents[0].title).toEqual(
              'What is a lord in England?'
            );
            expect(res.body.documents[0].access).toEqual('public');
            done();
          });
      });
    });

    describe('when a super admin whats to access all documents', () => {
      it('expect that the 4th document is a private and the userId id "4" and document title is "Just in the creep"', (done) => {
        chai
          .request(server)
          .get('/api/v1/documents')
          .set({ authorization: superAdminToken })
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.documents)).toBe(true);
            expect(res.body.documents[3].title).toEqual('Just in the creep');
            expect(res.body.documents[3].access).toEqual('private');
            expect(res.body.documents[3].userId).toEqual(4);
            done();
          });
      });
    });

    describe('when the search query does not match any document title', () => {
      it('expect a 404 response and a message "No search result"', (done) => {
        chai
          .request(server)
          .get('/api/v1/documents/?q=genetic')
          .set({ authorization: superAdminToken })
          .end((err, res) => {
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('No search result');
            done();
          });
      });
    });
  });

  describe('GET /api/v1/documents/:id route', () => {
    describe('when a valid, but non existent document id parameter is provided', () => {
      it('expect a 404 response and a message "Document not found"', (done) => {
        chai
          .request(server)
          .get('/api/v1/documents/65')
          .set({ authorization: adminToken })
          .end((err, res) => {
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('Document not found');
            done();
          });
      });
    });

    describe('when an invalid document id is is provided', () => {
      it('expect a 400 response and a message "Invalid id"', (done) => {
        chai
          .request(server)
          .get('/api/v1/documents/eye')
          .set({ authorization: superAdminToken })
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Invalid id');
            done();
          });
      });
    });

    describe('when a valid document id is "7"', () => {
      it('expect a 200 response and a document title to be "My dream date was awesome"', (done) => {
        chai
          .request(server)
          .get('/api/v1/documents/7')
          .set({ authorization: superAdminToken })
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.title).toEqual('My dream date was awesome');
            done();
          });
      });
    });
  });

  describe('GET /api/v1/search/documents route', () => {

    describe('when search query is "how"', () => {
      it('should return all documents with "how" contained in the title ', (done) => {
        chai
          .request(server)
          .get('/api/v1/search/documents/?q=how')
          .set({ authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.documents[0].title).toEqual('How to eat an elephant');
            expect(res.body.documents[1].title).toEqual(
              'How much does it cost to buy a title'
            );
            done();
          });
      });
    });
  });

  describe('PUT /api/v1/documents/:id route', () => {
    describe('when user wants to update a document that does not exist in database', () => {
      it('should respond with status 404 and error message "Document not found"', (done) => {
        chai
          .request(server)
          .put('/api/v1/documents/23')
          .set({ authorization: regularUserToken })
          .send({ title: 'How to stop global warming' })
          .end((err, res) => {
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('Document not found');
            done();
          });
      });
    });

    describe('when a user wants to edit a document that belogs to others', () => {
      it('should respond with status 403 and error message "Not permitted to edit document', (done) => {
        chai
          .request(server)
          .put('/api/v1/documents/12')
          .set({ authorization: regularUserToken })
          .send({ title: 'How to stop global warming' })
          .end((err, res) => {
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('Not permitted to edit document');
            done();
          });
      });
    });

    describe('when a user wants to edit their document', () => {
      it('should respond with 200 status and new document title "How to stop global warming"', (done) => {
        chai
          .request(server)
          .put('/api/v1/documents/11')
          .set({ authorization: regularUserToken })
          .send({ title: 'How to stop global warming' })
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.title).toEqual('How to stop global warming');
            done();
          });
      });
    });

    describe('when an invalid document id is provided', () => {
      it('should respond with 400 status and message "Invalid id"', (done) => {
        chai
          .request(server)
          .put('/api/v1/documents/rer')
          .set({ authorization: regularUserToken })
          .send({ title: 'How to stop global warming' })
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Invalid id');
            done();
          });
      });
    });
  });

  describe('DELETE /api/v1/documents/:id route', () => {
    describe('when a document id that does not exist in database is provided', () => {
      it('expect a 404 status code and a response message "Document not found"', (done) => {
        chai
          .request(server)
          .delete('/api/v1/documents/23')
          .set({ authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('Document not found');
            done();
          });
      });
    });

    describe('when a user wants to delete a document that belogs to others', () => {
      it('expect a 403 status code and response message "Not permitted to delete document"', (done) => {
        chai
          .request(server)
          .delete('/api/v1/documents/17')
          .set({ authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).toBe(403);
            expect(res.body.message).toEqual('Not permitted to delete document');
            done();
          });
      });
    });

    describe('when user wants to delete their', () => {
      it('should respond with 200 status and a message "Document deleted successfully"', (done) => {
        chai
          .request(server)
          .delete('/api/v1/documents/20')
          .set({ authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual('Document deleted successfully');
            done();
          });
      });
    });

    describe('when a user provides an invalid document id', () => {
      it('should respond with 400 status and a message "Invalid id"', (done) => {
        chai
          .request(server)
          .delete('/api/v1/documents/hd')
          .set({ authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual('Invalid id');
            done();
          });
      });
    });
  });
});
