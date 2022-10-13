import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { AuthGuard } from '@nestjs/passport';
import { AbilityGuard } from '../ability/ability.guard';
import { CheckAbility } from '../ability/ability.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Languages')
@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'admin/languages',
  version: '1',
})
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @ApiOperation({ summary: 'Get all languages endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: [
          {
            id: 1,
            locale: 'en',
            label: 'English',
            created_at: '2022-10-13T11:24:26.835Z',
            updated_at: '2022-10-13T11:24:26.835Z',
          },
          {
            id: 2,
            locale: 'uz',
            label: "O'zbekcha",
            created_at: '2022-10-13T11:24:26.843Z',
            updated_at: '2022-10-13T11:24:26.843Z',
          },
          {
            id: 3,
            locale: 'ru',
            label: 'Русский',
            created_at: '2022-10-13T11:24:26.846Z',
            updated_at: '2022-10-13T11:24:26.846Z',
          },
        ],
      },
    },
    description: 'Successful response!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'index', subject: 'Language' })
  @Get()
  async findAll() {
    return { data: await this.languagesService.findAll() };
  }

  @ApiOperation({ summary: 'Get language by locale endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          id: 2,
          locale: 'uz',
          label: "O'zbekcha",
          created_at: '2022-10-13T11:24:26.843Z',
          updated_at: '2022-10-13T11:24:26.843Z',
        },
      },
    },
    description: 'Successful response!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'read', subject: 'Language' })
  @Get(':locale')
  async findOne(@Param('locale') locale: string) {
    return { data: await this.languagesService.findOneByLocale(locale) };
  }
}
