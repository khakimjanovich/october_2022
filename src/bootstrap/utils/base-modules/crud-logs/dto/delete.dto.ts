import { IsNotEmpty, MinLength } from 'class-validator';

export class DeleteDto {
  @IsNotEmpty()
  @MinLength(4)
  deleted_reason: string;
}
