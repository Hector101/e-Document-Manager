import expect from 'expect';
import models from '../../models';

import fakeDocuments from '../__mock__/fakeDocuments';


const { newDocument, invalidFieldDocument } = fakeDocuments;

describe('Document model', () => {
  describe('#Document.create', () => {
    it(`should create a user document when all 
    required documents fields is provided and valid`, (done) => {
      models.Document.create(newDocument)
      .then((user) => {
        expect(user.dataValues.title).toEqual(newDocument.title);
        expect(user.dataValues.content).toEqual(newDocument.content);
        expect(user.dataValues.access).toEqual(newDocument.access);
        done();
      })
      .catch();
    });

    it('should throw error if document title already exist', (done) => {
      models.Document.create(newDocument)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('Document title already exist');
        done();
      });
    });

    it('should throw error if invalid access name is provided', (done) => {
      models.Document.create(invalidFieldDocument)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).toEqual('Invalid access type provided');

        done();
      });
    });
  });

  describe('#Document.update', () => {
    it(`should update a user 
    document by owner of document`, (done) => {
      models.Document.findById('16')
        .then((document) => {
          document.update({ title: 'React ecosystem is a mess' })
            .then((documentUpdate) => {
              expect(documentUpdate.dataValues.title)
              .toEqual('React ecosystem is a mess');

              done();
            });
        });
    });
  });

  describe('#Documents.destroy', () => {
    it(`should delete a user document, 
    when document id belongs to a user`, (done) => {
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

