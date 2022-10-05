import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../utils/validators/is-exists.validator';

export class AuthEmailLoginDto {
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  email: string;

  @IsNotEmpty()
  password: string;
}
