import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { DeleteFileDto } from './dto/delete-file.dto';
import { AbilityGuard } from '../../utils/ability/ability.guard';
import { CheckAbility } from '../../utils/ability/ability.decorator';

@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    return await this.filesService.paginate(page, page_size);
  }

  @UseGuards(AuthGuard('jwt'), AbilityGuard)
  @CheckAbility({ action: 'trash', subject: 'File' })
  @Get('/trash')
  async trash(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    const [data, count] = await this.filesService.trash(page, page_size);

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @UseGuards(AuthGuard('jwt'), AbilityGuard)
  @CheckAbility({ action: 'create', subject: 'File' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() request, @UploadedFile() file) {
    return this.filesService.uploadFile(file, request.user);
  }

  @Get(':path')
  show(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }

  @UseGuards(AuthGuard('jwt'), AbilityGuard)
  @CheckAbility({ action: 'delete', subject: 'File' })
  @Post('/:id')
  async delete(
    @Request() request,
    @Param('id') id: string,
    @Body() deleteFileDto: DeleteFileDto,
  ) {
    return this.filesService.delete(+id, deleteFileDto, request.user.id);
  }
}
