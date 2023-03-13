import { CreateBackendUserDto } from './create-backend_user.dto';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateBackendUserDto extends CreateBackendUserDto {
  @IsOptional()
  @MinLength(6)
  password: string;
}
