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
import { ApiProperty } from '@nestjs/swagger';

@Entity('backend_users')
export class BackendUser {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Super Admin', description: 'Name of the user' })
  @Column()
  name: string;

  @ApiProperty({ example: 'en', description: 'Locale of the entity' })
  @Index()
  @Column()
  locale: string;

  @ApiProperty({
    example: 'superadmin@gmail.com',
    description: 'Email of the user',
  })
  @Column()
  email: string;

  @ApiProperty({ example: 'secret', description: 'User password' })
  @Column()
  password: string;

  @ApiProperty({
    example:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    description: 'Profile picture of the user',
  })
  @Column({ nullable: true })
  avatar?: string | null;

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
