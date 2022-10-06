import { IsNotEmpty, MinLength } from 'class-validator';

export class DeleteFileDto {
  @IsNotEmpty()
  @MinLength(4)
  deleted_reason: string;
}
