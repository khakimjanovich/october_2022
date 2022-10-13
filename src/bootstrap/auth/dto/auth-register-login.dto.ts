import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'User', description: 'Full name of the user' })
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'User email address has to be lower case',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['BackendUser', 'email'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    description: 'Profile picture of the user',
  })
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: 'secret', description: 'User password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'uz', description: 'User locale' })
  @Validate(IsExist, ['Language', 'locale'], {
    message: 'locale.doesNotExist',
  })
  @IsNotEmpty()
  locale: string;
}
