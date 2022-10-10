import { IsOptional, MinLength, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Role } from '../../roles/entities/role.entity';

export class UpdateBackendUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  @MinLength(6)
  password: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  @Validate(IsExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  role?: Role;

  @Validate(IsExist, ['Language', 'locale'], {
    message: 'locale.doesNotExist',
  })
  @IsOptional()
  locale: string;
}
