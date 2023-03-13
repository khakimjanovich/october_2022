import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { CrudLog } from 'src/utils/base-modules/crud-logs/entities/crud-logs.entity';

@Entity({ name: 'roles' })
export class Role extends CrudLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: Permission[];
}
