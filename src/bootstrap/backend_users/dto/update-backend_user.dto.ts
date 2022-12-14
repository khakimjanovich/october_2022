import { IsNotEmpty, IsOptional, MinLength, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Role } from '../../roles/entities/role.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBackendUserDto } from './create-backend_user.dto';

export class UpdateBackendUserDto extends PartialType(CreateBackendUserDto) {
  @ApiProperty({
    required: false,
    example: 'User name',
    description: 'User name',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    example: 'user@email.com',
    description: 'User email',
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    required: false,
    example: 'secret',
    description: 'User password',
  })
  @IsOptional()
  @MinLength(6)
  password: string;

  @ApiProperty({
    required: false,
    example:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    description: 'Profile picture of the user',
  })
  @IsOptional()
  avatar: string;

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
