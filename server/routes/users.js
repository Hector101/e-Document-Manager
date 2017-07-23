

export default (router) => {
  router.post('/users/login');

  router.get('/users', (req, res) => {
    res.status(200).send('Welcome User');
  });
  router.get('/users/:id');
  router.get('/users/:id/documents');
  router.get('/search/users');

  router.put('/users/:id');

  router.delete('/users/:id');
};
