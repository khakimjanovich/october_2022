import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../permissions/entities/permission.entity';
import { CrudLog } from '../../utils/base-modules/crud-logs/entities/crud-logs.entity';

@Entity({ name: 'roles' })
export class Role extends CrudLog {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Admin' })
  @Column()
  name: string;

  @ManyToMany(() => Permission, {
    eager: true,
  })
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: Permission[];
}
