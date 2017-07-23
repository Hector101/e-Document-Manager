
import users from './users';
import documents from './documents';
import roles from './roles';

export default (router) => {
  users(router);
  documents(router);
  roles(router);
};
