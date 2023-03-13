import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { AbilityGuard } from '../../utils/ability/ability.guard';
import { CheckAbility } from '../../utils/ability/ability.decorator';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @CheckAbility({ action: 'index', subject: 'Role' })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    return this.rolesService.paginate(page, page_size);
  }

  @CheckAbility({ action: 'trash', subject: 'Role' })
  @Get('/trash')
  trashed(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    return this.rolesService.trash(page, page_size);
  }

  @CheckAbility({ action: 'read', subject: 'Role' })
  @Get(':id')
  async show(@Param('id') id: string) {
    return { data: await this.rolesService.findOne(+id) };
  }

  @CheckAbility({ action: 'create', subject: 'Role' })
  @Post('/')
  async create(@Body() createRoleDto: CreateRoleDto, @Request() request) {
    return {
      data: await this.rolesService.create(
        request,
        createRoleDto,
        request.user.id,
      ),
    };
  }

  @CheckAbility({ action: 'update', subject: 'Role' })
  @Put(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return {
      data: await this.rolesService.update(
        request,
        +id,
        updateRoleDto,
        request.user.id,
      ),
    };
  }

  @Post(':id')
  async delete(
    @Request() request,
    @Param('id') id: string,
    @Body() deleteRoleDto: DeleteRoleDto,
  ) {
    return {
      data: await this.rolesService.remove(
        request,
        +id,
        deleteRoleDto,
        request.user.id,
      ),
    };
  }
}
