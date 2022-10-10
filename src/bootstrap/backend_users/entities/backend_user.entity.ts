import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '../../roles/entities/role.entity';
import { CrudLog } from '../../utils/base-modules/crud-logs/entities/crud-logs.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { RoleEnum } from '../../roles/roles.enum';

@Entity('backend_users')
export class BackendUser extends CrudLog {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar?: string | null;

  public previousPassword: string;

  public all_permissions: string[];

  @ManyToOne(() => Role, {
    eager: true,
  })
  @JoinColumn({
    name: 'role_id',
  })
  role?: Role | null;

  @ManyToMany(() => Permission, {
    eager: true,
  })
  @JoinTable({
    name: 'backend_user_permission',
    joinColumn: { name: 'backend_user_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: Permission[];

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @AfterLoad()
  public loadPermissions(): void {
    const role_permissions = this.role?.permissions?.map((permission) => {
      return permission.subject + '.' + permission.action;
    });

    const user_permissions = this.permissions?.map((permission) => {
      return permission.subject + '.' + permission.action;
    });

    if (role_permissions && user_permissions)
      this.all_permissions = [...role_permissions, ...user_permissions];
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setRole() {
    if (!this.role) {
      this.role = { id: RoleEnum.user } as Role;
    }
  }
}