import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {
  @ApiProperty({
    required: true,
    example: 'This has to be deleted',
    description: 'Reason for deletion',
  })
  @IsNotEmpty()
  @MinLength(4)
  deleted_reason: string;
}
