import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Role name' })
  @IsString()
  @IsNotEmpty()
  @Validate(IsNotExist, ['Role', 'name'], {
    message: 'nameAlreadyExists',
  })
  name: string;

  @ApiProperty({
    example: [1, 2, 3, 4],
    description: 'Role permissions id',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  permissions: number[];
}
