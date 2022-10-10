import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BackendUsersService } from "../backend_users/backend_users.service";

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
  | 'BackendUser'
  | 'File';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(
    @Inject(forwardRef(() => BackendUsersService))
    private readonly userService: BackendUsersService,
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
