import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from '../../../entity-helper';
import { User } from '../../../../users/entities/user.entity';

export class CrudLog extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  locale: string;

  @Column({ nullable: true })
  deleted_reason?: string | null;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'created_by_id',
  })
  created_by?: User | null;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'last_updated_by_id',
  })
  last_update_by?: User | null;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'deleted_by_id',
  })
  deleted_by?: User | null;

  @CreateDateColumn()
  created_at?: Date | null;

  @UpdateDateColumn()
  updated_at?: Date | null;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
