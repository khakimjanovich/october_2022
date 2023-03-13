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
import { BackendUser } from '../../backend_users/entities/backend_user.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  original_url: string;

  @Column({ default: {}, type: 'simple-json' })
  before_update_action: object;

  @Column({ default: {}, type: 'simple-json' })
  after_update_action: object;

  @ManyToOne(() => BackendUser)
  @JoinColumn({
    name: 'user_id',
  })
  user: BackendUser;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

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
