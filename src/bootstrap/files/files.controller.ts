import {
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus, Body
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { DeleteFileDto } from './dto/delete-file.dto';

@ApiTags('Files')
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
    const [data, total] = await this.filesService.paginate(page, page_size);

    return {
      page,
      data,
      total,
      page_size,
    };
  }

  @Get('/trash')
  async trash(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    const [data, total] = await this.filesService.trash(page, page_size);

    return {
      page,
      data,
      total,
      page_size,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() request, @UploadedFile() file) {
    return this.filesService.uploadFile(file, request.user);
  }

  @Get(':path')
  download(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  async delete(
    @Request() request,
    @Param('id') id: string,
    @Body() deleteFileDto: DeleteFileDto,
  ) {
    return this.filesService.delete(+id, deleteFileDto, request.user.id);
  }
}
