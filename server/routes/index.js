
import Users from './Users';
import Documents from './Documents';
import Roles from './Roles';

export default (router) => {
  Users(router);
  Documents(router);
  Roles(router);
};
