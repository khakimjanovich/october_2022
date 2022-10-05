import { SetMetadata } from '@nestjs/common';
import { Actions, Subjects } from './ability.factory';

export interface RequiredRule {
  action: Actions;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbility = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
