import { IsNumber } from 'class-validator';

export class UpdateBackendUserPermissionsDto {
  @IsNumber({}, { each: true })
  permissions: number[];
}
