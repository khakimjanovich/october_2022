import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUpdateDto {
  @ApiProperty({
    required: false,
    example: 'Super admin updated',
    description: 'User name',
  })
  @MinLength(1)
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    example: 'user@mail.com',
    description: 'User email address',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    description: 'Profile picture of the user',
    required: false,
  })
  @IsOptional()
  avatar: string;

  @ApiProperty({
    example: 'secret',
    description: 'User password',
    required: false,
  })
  @IsOptional()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'uz', description: 'User locale', required: false })
  @Validate(IsExist, ['Language', 'locale'], {
    message: 'locale.doesNotExist',
  })
  @IsOptional()
  locale: string;
}
