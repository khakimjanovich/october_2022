import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotExist } from '../../../bootstrap/utils/validators/is-not-exists.validator';
import { IsExist } from '../../../bootstrap/utils/validators/is-exists.validator';

export class AuthRegisterLoginDto {
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['User', 'email'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Validate(IsExist, ['Language', 'locale'], {
    message: 'locale.doesNotExist',
  })
  @IsNotEmpty()
  locale: string;
}
