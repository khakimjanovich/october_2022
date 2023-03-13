import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { BackendUser } from '../../../../modules/backend_users/entities/backend_user.entity';

export class CrudLog extends BaseEntity {
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
