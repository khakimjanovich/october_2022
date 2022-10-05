import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Optional } from '@nestjs/common';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

export class AuthRegisterLoginDto {
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @Optional()
  @Validate(IsExist, ['Language', 'locale'], {
    message: 'languageNotExists',
  })
  locale: string;
}
