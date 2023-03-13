import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../../utils/validators/is-exists.validator';

export class AuthUpdateDto {
  @MinLength(1)
  @IsOptional()
  name: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  @MinLength(6)
  password: string;

  @Validate(IsExist, ['Language', 'locale'], {
    message: 'locale.doesNotExist',
  })
  @IsOptional()
  locale: string;
}
