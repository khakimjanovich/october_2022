import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'index';

export type Subjects = 'Activity' | 'Language' | 'Permission' | 'Role' | 'User';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async defineAbility(user_id: number) {
    const user = await this.userService.findOne(user_id);

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
