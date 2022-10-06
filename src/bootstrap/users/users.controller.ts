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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() request,
  ): Promise<{ data: User }> {
    return {
      data: await this.usersService.create(createUserDto, request.user.id),
    };
  }

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

  @Get(':id')
  async show(@Param('id') id: string) {
    return { data: await this.usersService.findOne(+id) };
  }

  @Patch(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      data: await this.usersService.update(+id, updateUserDto, request.user.id),
    };
  }

  @Post(':id')
  async delete(
    @Request() request,
    @Param('id') id: string,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    return {
      data: await this.usersService.remove(+id, deleteUserDto, request.user.id),
    };
  }
}
