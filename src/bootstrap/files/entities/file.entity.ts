import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Allow } from 'class-validator';
import { appConfig } from '../../config/app.config';
import { CrudLog } from '../../utils/base-modules/crud-logs/entities/crud-logs.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'files' })
export class File extends CrudLog {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

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
