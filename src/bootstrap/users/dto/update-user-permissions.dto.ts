import { IsNumber } from 'class-validator';

export class UpdateUserPermissionsDto {
  @IsNumber({}, { each: true })
  permissions: number[];
}
