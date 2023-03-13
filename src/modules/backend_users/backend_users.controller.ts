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
import { DeleteBackendUserDto } from './dto/delete-backend_user.dto';
import { BackendUser } from './entities/backend_user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBackendUserPermissionsDto } from './dto/update-backend_user-permissions.dto';
import { AbilityGuard } from '../../utils/ability/ability.guard';
import { CheckAbility } from '../../utils/ability/ability.decorator';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'backend-users',
  version: '1',
})
export class BackendUsersController {
  constructor(private readonly usersService: BackendUsersService) {}

  @CheckAbility({ action: 'create', subject: 'BackendUser' })
  @Post()
  async create(
    @Body() createUserDto: CreateBackendUserDto,
    @Request() request,
  ): Promise<{ data: BackendUser }> {
    return {
      data: await this.usersService.create(
        request,
        createUserDto,
        request.user.id,
      ),
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
    return await this.usersService.paginate(page_size, page, search);
  }

  @CheckAbility({ action: 'trash', subject: 'BackendUser' })
  @Get('trash')
  async trash(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return await this.usersService.trash(page_size, page, search);
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
      data: await this.usersService.update(
        request,
        +id,
        updateUserDto,
        request.user.id,
      ),
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
        request,
        +id,
        updateUserPermissionsDto,
        request.user.id,
      ),
    };
  }

  @Post(':id')
  async delete(
    @Request() request,
    @Param('id') id: string,
    @Body() deleteUserDto: DeleteBackendUserDto,
  ) {
    return {
      data: await this.usersService.remove(
        request,
        +id,
        deleteUserDto,
        request.user.id,
      ),
    };
  }
}
