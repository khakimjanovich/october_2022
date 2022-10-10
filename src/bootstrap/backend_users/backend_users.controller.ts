import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BackendUsersService } from './backend_users.service';
import { CreateBackendUserDto } from './dto/create-backend_user.dto';
import { UpdateBackendUserDto } from './dto/update-backend_user.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeleteBackendUserDto } from './dto/delete-backend_user.dto';
import { BackendUser } from './entities/backend_user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBackendUserPermissionsDto } from './dto/update-backend_user-permissions.dto';
import { CheckAbility } from '../ability/ability.decorator';
import { AbilityGuard } from '../ability/ability.guard';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@ApiTags('BackendUsers')
@Controller({
  path: 'admin/backend-users',
  version: '1',
})
export class BackendUsersController {
  constructor(private readonly usersService: BackendUsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateBackendUserDto,
    @Request() request,
  ): Promise<{ data: BackendUser }> {
    return {
      data: await this.usersService.create(createUserDto, request.user.id),
    };
  }

  @CheckAbility({ action: 'index', subject: 'BackendUser' })
  @Get()
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    const [data, count] = await this.usersService.paginate(
      page_size,
      page,
      search,
    );
    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @CheckAbility({ action: 'trash', subject: 'BackendUser' })
  @Get('trash')
  async trash(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    const [data, count] = await this.usersService.trash(
      page_size,
      page,
      search,
    );

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @CheckAbility({ action: 'read', subject: 'BackendUser' })
  @Get(':id')
  async show(@Param('id') id: string) {
    return { data: await this.usersService.findOne(+id) };
  }

  @CheckAbility({ action: 'update', subject: 'BackendUser' })
  @Patch(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateBackendUserDto,
  ) {
    return {
      data: await this.usersService.update(+id, updateUserDto, request.user.id),
    };
  }

  @CheckAbility({ action: 'update', subject: 'BackendUser' })
  @Post(':id/permissions')
  async updatePermissions(
    @Request() request,
    @Param('id') id: string,
    @Body() updateUserPermissionsDto: UpdateBackendUserPermissionsDto,
  ) {
    return {
      data: await this.usersService.updatePermissions(
        +id,
        updateUserPermissionsDto,
        request.user.id,
      ),
    };
  }

  @CheckAbility({ action: 'delete', subject: 'BackendUser' })
  @Post(':id')
  async delete(
    @Request() request,
    @Param('id') id: string,
    @Body() deleteUserDto: DeleteBackendUserDto,
  ) {
    return {
      data: await this.usersService.remove(+id, deleteUserDto, request.user.id),
    };
  }
}
