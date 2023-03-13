import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Allow } from 'class-validator';
import { CrudLog } from '../../../utils/base-modules/crud-logs/entities/crud-logs.entity';
import appConfig from '../../../config/app.config';

@Entity({ name: 'files' })
export class File extends CrudLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column()
  path: string;

  @Column()
  name: string;

  @Column()
  size: string;

  @Column()
  mime_type: string;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = appConfig().backendDomain + this.path;
    }
  }
}
