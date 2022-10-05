import { User } from './entities/user.entity';

const userResponseSerializer = (user: User) => {
  delete user.password;
  delete user.previousPassword;
  delete user.deleted_at;
  delete user.role?.permissions;
  delete user.deleted_reason;
  delete user.permissions;
};

export default userResponseSerializer;
