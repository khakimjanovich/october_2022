import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { Role } from '../../roles/entities/role.entity';
import { IsNotExist } from '../../../utils/validators/is-not-exists.validator';
import { IsExist } from '../../../utils/validators/is-exists.validator';

export class CreateBackendUserDto {
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['BackendUser', 'email'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;
  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @Validate(IsExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  role?: Role | null;

  @Validate(IsExist, ['Language', 'locale'], {
    message: 'locale.doesNotExist',
  })
  @IsNotEmpty()
  locale: string;
}
