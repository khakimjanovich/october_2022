import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BackendUser } from '../../../../backend_users/entities/backend_user.entity';

export class CrudLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  locale: string;

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
  last_update_by?: BackendUser | null;

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
