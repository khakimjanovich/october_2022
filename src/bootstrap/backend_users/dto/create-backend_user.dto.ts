import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { CreateCrudLogDto } from '../../utils/base-modules/crud-logs/dto/create-crud-log.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Role } from '../../roles/entities/role.entity';

export class CreateBackendUserDto extends PartialType(CreateCrudLogDto) {
  @ApiProperty({
    required: true,
    example: 'User name',
    description: 'User name',
  })
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    example: 'user@email.com',
    description: 'User email',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['BackendUser', 'email'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    required: false,
    example:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    description: 'Profile picture of the user',
  })
  @IsOptional()
  avatar: string;

  @ApiProperty({
    required: true,
    example: 'secret',
    description: 'User password',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    required: false,
    example: '2',
    description: 'User Role, leave empty for default role',
  })
  @IsNotEmpty()
  @Validate(IsExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  role?: Role | null;

  @ApiProperty({
    required: true,
    example: 'uz',
    description: 'User locale',
  })
  @Validate(IsExist, ['Language', 'locale'], {
    message: 'locale.doesNotExist',
  })
  @IsNotEmpty()
  locale: string;
}
