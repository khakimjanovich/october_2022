import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AbilityGuard } from '../../bootstrap/ability/ability.guard';
import { CheckAbility } from '../../bootstrap/ability/ability.decorator';
import { DeleteUserDto } from './dto/delete-user.dto';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CheckAbility({ action: 'create', subject: 'User' })
  @Post()
  create(@Request() request, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, request.user.id);
  }

  @CheckAbility({ action: 'index', subject: 'User' })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return this.usersService.paginate(page_size, page, search);
  }

  @CheckAbility({ action: 'read', subject: 'User' })
  @Get(':id')
  show(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @CheckAbility({ action: 'update', subject: 'User' })
  @Patch(':id')
  update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto, request.user.id);
  }

  @CheckAbility({ action: 'delete', subject: 'User' })
  @Delete(':id')
  remove(
    @Request() request,
    @Param('id') id: string,
    deleteUserDto: DeleteUserDto,
  ) {
    return this.usersService.remove(+id, deleteUserDto, request.user.id);
  }
}
