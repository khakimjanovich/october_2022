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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { DeleteFileDto } from './dto/delete-file.dto';
import { AbilityGuard } from '../ability/ability.guard';
import { CheckAbility } from '../ability/ability.decorator';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'The list of the files with links' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    schema: {
      example: {
        page: 1,
        data: [],
        count: 0,
        page_size: 10,
      },
    },
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    const [data, count] = await this.filesService.paginate(page, page_size);

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AbilityGuard)
  @ApiOperation({ summary: 'The list of the trashed files with links' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    schema: {
      example: {
        page: 1,
        data: [],
        count: 0,
        page_size: 10,
      },
    },
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AbilityGuard)
  @CheckAbility({ action: 'create', subject: 'File' })
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload FILE' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        path: 'http://localhost:3000/api/v1/admin/files/feb63a11-4d13-44b3-a43d-802909d7d2d7.jpeg',
        created_by: {
          id: 1,
          locale: 'uz',
          email: 'admin@example.com',
        },
        deleted_reason: null,
        deleted_at: null,
        created_at: '2022-10-15T12:40:35.643Z',
        updated_at: '2022-10-15T12:40:35.643Z',
        id: 1,
      },
    },
    description: 'Successful response',
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
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() request, @UploadedFile() file) {
    return this.filesService.uploadFile(file, request.user);
  }

  @ApiOperation({ summary: 'Get file' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message:
          'Cannot GET /api/v1/admin/files/feb63a11-4d13-44b3-a43d-802909d7d2d7.jpeg',
        error: 'Not Found',
      },
    },
  })
  @Get(':path')
  show(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file' })
  @UseGuards(AuthGuard('jwt'), AbilityGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        generatedMaps: [],
        raw: [],
        affected: 1,
      },
    },
    description: 'Forbidden response!',
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
