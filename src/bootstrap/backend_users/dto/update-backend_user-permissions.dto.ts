import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBackendUserPermissionsDto {
  @ApiProperty({
    required: true,
    example: [1, 2, 3, 4, 5],
    description: 'User permissions',
  })
  @IsNumber({}, { each: true })
  permissions: number[];
}
