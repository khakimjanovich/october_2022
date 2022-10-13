import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsNotExist, ['Role', 'name'], {
    message: 'nameAlreadyExists',
  })
  name: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  permissions: number[];
}
