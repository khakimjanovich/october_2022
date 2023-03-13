import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { AuthGuard } from '@nestjs/passport';
import { AbilityGuard } from '../../utils/ability/ability.guard';
import { CheckAbility } from '../../utils/ability/ability.decorator';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'admin/languages',
  version: '1',
})
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @CheckAbility({ action: 'index', subject: 'Language' })
  @Get()
  async findAll() {
    return { data: await this.languagesService.findAll() };
  }

  @CheckAbility({ action: 'read', subject: 'Language' })
  @Get(':locale')
  async findOne(@Param('locale') locale: string) {
    return { data: await this.languagesService.findOneByLocale(locale) };
  }
}
