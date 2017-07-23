
export default (router) => {
  router.post('/roles');

  router.get('/roles', (req, res) => {
    res.status(200).send('Welcome Role');
  });
  router.get('/roles/:id');

  router.put('/roles/:id');

  router.delete('/roles/:id');
};
