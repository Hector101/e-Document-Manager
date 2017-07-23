

export default (router) => {
  router.post('/documents');

  router.get('/documents', (req, res) => {
    res.status(200).send('Welcome Documents');
  });
  router.get('/documents/:id');
  router.get('/search/documents');

  router.put('/documents/:id');

  router.delete('/documents/:id');
};
