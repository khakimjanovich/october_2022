import { IsOptional, MinLength, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';

export class AuthUpdateDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @MinLength(6)
  password: string;

  @IsOptional()
  @Validate(IsExist, ['Language', 'locale'], {
    message: 'languageCodeNotExists',
  })
  locale: string;

  @IsOptional()
  email: string;
}
