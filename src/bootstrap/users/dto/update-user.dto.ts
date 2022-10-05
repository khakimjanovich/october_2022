import { IsOptional, MinLength, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  @MinLength(6)
  password: string;

  @Validate(IsExist, ['Language', 'locale'], {
    message: 'locale.doesNotExist',
  })
  @IsOptional()
  locale: string;
}
