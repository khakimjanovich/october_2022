import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'languages' })
export class Language extends BaseEntity {
  @ApiProperty({ example: '1', description: 'The unique ID of the language' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'uz_Uz', description: 'The locale of the language' })
  @Column()
  @Index()
  locale: string;

  @ApiProperty({
    example: 'O`zbekcha',
    description: 'The label of the language',
  })
  @Column()
  label: string;

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
}
