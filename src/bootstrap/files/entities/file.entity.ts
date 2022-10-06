import { AfterInsert, AfterLoad, Column, Entity } from 'typeorm';
import { Allow } from 'class-validator';
import { appConfig } from '../../config/app.config';
import { CrudLog } from '../../utils/base-modules/crud-logs/entities/crud-logs.entity';

@Entity({ name: 'files' })
export class File extends CrudLog {
  @Allow()
  @Column()
  path: string;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = appConfig().backendDomain + this.path;
    }
  }
}
