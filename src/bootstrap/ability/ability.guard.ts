import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './ability.factory';
import { CHECK_ABILITY, RequiredRule } from './ability.decorator';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRules = this.reflector.getAllAndOverride<RequiredRule[]>(
      CHECK_ABILITY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRules) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const ability = await this.abilityFactory.defineAbility(user.id);

    return requiredRules.every((rule) =>
      ability.can(rule.action, rule.subject),
    );
  }
}
