import { BackendUser } from './entities/backend_user.entity';
import { User } from '../../modules/users/entities/user.entity';

export const backendUserResponseSerializer = (user: BackendUser) => {
  delete user.password;
  delete user.previousPassword;
  delete user.role?.permissions;
  // delete user.permissions;
};

export const userResponseSerializer = (user: User) => {
  delete user.password;
  delete user.previousPassword;
};
