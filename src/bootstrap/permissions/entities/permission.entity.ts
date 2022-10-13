import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('permissions')
export class Permission extends BaseEntity {
  @ApiProperty({ description: 'Permission id', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'Permission action', example: 'create' })
  @Column()
  action: string;

  @ApiProperty({ description: 'Permission subject', example: 'users' })
  @Column()
  subject: string;
}
