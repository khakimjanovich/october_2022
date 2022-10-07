import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActivitiesRouteTypeEnum } from '../activities-route-type.enum';

export class CreateActivityDto {
  @ApiProperty({
    example: 'Permissions was updated!',
    description: 'Specific comment for the action',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: ActivitiesRouteTypeEnum.post,
    description: 'Type of the operation was held by the client/robot',
  })
  @IsNotEmpty()
  request_type: ActivitiesRouteTypeEnum;

  @ApiProperty({ example: '/permissions', description: 'The route was used' })
  @IsNotEmpty()
  route: string;

  @IsOptional()
  before_update_action: object;

  @IsOptional()
  after_update_action: object;
}
