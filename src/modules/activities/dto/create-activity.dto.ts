import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  original_url: string;

  @IsOptional()
  before_update_action: object;

  @IsOptional()
  after_update_action: object;
}
