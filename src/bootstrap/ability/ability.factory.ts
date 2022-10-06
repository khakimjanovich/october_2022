import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

export type Actions =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'index'
  | 'trash';

export type Subjects =
  | 'Activity'
  | 'Language'
  | 'Permission'
  | 'Role'
  | 'User'
  | 'File';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async defineAbility(email: string) {
    const user = await this.userService.findOneByEmail(email);

    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    user.all_permissions.forEach((permission) => {
      const action: string = permission.split('.')[1];
      const subject: string = permission.split('.')[0];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      can(action, subject);
    });

    return build();
  }
}
