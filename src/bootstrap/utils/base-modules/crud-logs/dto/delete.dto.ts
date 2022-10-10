import { IsNotEmpty } from 'class-validator';

export class DeleteDto {
  @IsNotEmpty()
  deleted_reason: string;
}
