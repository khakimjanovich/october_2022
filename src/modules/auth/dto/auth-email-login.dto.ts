import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../../bootstrap/utils/validators/is-exists.validator';

export class AuthEmailLoginDto {
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsExist, ['User', 'email'], {
    message: 'emailNotExists',
  })
  email: string;

  @IsNotEmpty()
  password: string;
}
