import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'languages',
  version: '1',
})
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  async findAll() {
    return { data: await this.languagesService.findAll() };
  }

  @Get(':locale')
  async findOne(@Param('locale') locale: string) {
    return { data: await this.languagesService.findOneByLocale(locale) };
  }
}
