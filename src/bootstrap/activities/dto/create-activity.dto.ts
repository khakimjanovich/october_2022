import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({
    example: 'Permissions was updated!',
    description: 'Specific comment for the action',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'POST',
    description: 'Type of the operation was held by the client/robot',
  })
  @IsNotEmpty()
  request_type: string;

  @ApiProperty({ example: '/permissions', description: 'The route was used' })
  @IsNotEmpty()
  route: string;

  @IsOptional()
  before_update_action: object;

  @IsOptional()
  after_update_action: object;
}
