import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { BackendUser } from '../../../../backend_users/entities/backend_user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CrudLog extends BaseEntity {
  @ApiProperty({
    example: 'This has to be deleted',
    description: 'Reason of deletion',
  })
  @Column({ nullable: true })
  deleted_reason?: string | null;

  @ManyToOne(() => BackendUser)
  @JoinColumn({
    name: 'created_by_id',
  })
  created_by?: BackendUser | null;

  @ManyToOne(() => BackendUser)
  @JoinColumn({
    name: 'last_updated_by_id',
  })
  last_updated_by?: BackendUser | null;

  @ManyToOne(() => BackendUser)
  @JoinColumn({
    name: 'deleted_by_id',
  })
  deleted_by?: BackendUser | null;

  @ApiProperty({ example: new Date(), description: 'Creation date' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ example: new Date(), description: 'Last updated date' })
  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
