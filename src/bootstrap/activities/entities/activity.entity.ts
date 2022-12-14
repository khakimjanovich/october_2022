import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BackendUser } from '../../backend_users/entities/backend_user.entity';

@Entity('activities')
export class Activity {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Permissions was updated!',
    description: 'Specific comment for the action',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'POST',
    description: 'Type of the operation was held by the client/robot',
  })
  @Column({ nullable: true })
  request_type: string;

  @ApiProperty({ example: '/permissions', description: 'The route was used' })
  @Column({ nullable: true })
  route: string;

  @ApiProperty({
    example: "{'name':'permissions.index','label':'Browse permissions'}",
    description: 'Before updating something',
  })
  @Column({ nullable: true, type: 'simple-json' })
  before_update_action: object;

  @ApiProperty({
    example: "{'name':'permissions.list','label':'All permissions'}",
    description: 'After updating something',
  })
  @Column({ nullable: true, type: 'simple-json' })
  after_update_action: object;

  @ApiProperty({ example: '1', description: 'The user relation entity' })
  @ManyToOne(() => BackendUser)
  @JoinColumn({
    name: 'user_id',
  })
  user: BackendUser;

  @ApiProperty({
    example: '2022-01-02',
    description: 'The created at timestamp',
  })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({
    example: '2022-01-02',
    description: 'The updated at timestamp',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @BeforeInsert()
  serialize() {
    if (this.after_update_action && this.before_update_action) {
      this.before_update_action = Object.keys(this.before_update_action)
        .filter((key) => Object.keys(this.after_update_action).includes(key))
        .reduce((obj, key) => {
          obj[key] = this.before_update_action[key];
          return obj;
        }, {});
    }
  }
}
