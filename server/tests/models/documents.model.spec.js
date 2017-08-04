import expect from 'expect';
import models from '../../models';

import fakeDocuments from '../__mock__/fakeDocuments';


const { roleDocument, invalidFieldDocument } = fakeDocuments;

describe('User model', () => {
  describe('#Document.create', () => {
    it('should create a user document', (done) => {
      models.Document.create(roleDocument)
      .then((user) => {
        expect(user.dataValues.title).toEqual(roleDocument.title);
        expect(user.dataValues.content).toEqual(roleDocument.content);
        expect(user.dataValues.access).toEqual(roleDocument.access);
        done();
      })
      .catch();
    });

    it('should throw error if document title already exist', (done) => {
      models.Document.create(roleDocument)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('title must be unique');
        done();
      });
    });

    it('should throw error if invalid access name is provided', (done) => {
      models.Document.create(invalidFieldDocument)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('Validation isIn on access failed');

        done();
      });
    });
  });

  describe('#Document.update', () => {
    it('should update a user document by user id', (done) => {
      models.Document.findById('16')
        .then((document) => {
          document.update({ title: 'React ecosystem is a mess' })
            .then((documentUpdate) => {
              expect(documentUpdate.dataValues.title).toEqual('React ecosystem is a mess');

              done();
            });
        });
    });
  });

  describe('#Documents.destroy', () => {
    it('should delete a user document by user id', (done) => {
      models.Document.findById('6')
        .then((document) => {
          document.destroy()
            .then((documentUpdate) => {
              expect(documentUpdate[0]).toNotExist();

              done();
            });
        });
    });
  });
});

