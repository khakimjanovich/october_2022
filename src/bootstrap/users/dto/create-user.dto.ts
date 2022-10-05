import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { CreateCrudLogDto } from '../../utils/base-modules/crud-logs/dto/create-crud-log.dto';
import { PartialType } from '@nestjs/swagger';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

export class CreateUserDto extends PartialType(CreateCrudLogDto) {
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
