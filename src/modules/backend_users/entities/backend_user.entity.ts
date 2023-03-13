import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { RoleEnum } from '../../roles/roles.enum';

@Entity('backend_users')
export class BackendUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @Column()
  locale: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar?: string | null;

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

  public previousPassword: string;

  public all_permissions: string[];

  @ManyToOne(() => Role)
  @JoinColumn({
    name: 'role_id',
  })
  role?: Role | null;

  @ManyToMany(() => Permission)
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
