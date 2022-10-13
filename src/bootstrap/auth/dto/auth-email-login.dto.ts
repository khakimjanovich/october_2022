import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'admin@example.com', description: 'User email' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsExist, ['BackendUser', 'email'], {
    message: 'emailNotExists',
  })
  email: string;

  @ApiProperty({ example: 'secret', description: 'User password' })
  @IsNotEmpty()
  password: string;
}
