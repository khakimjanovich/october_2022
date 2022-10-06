import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';
import { DeleteFileDto } from './dto/delete-file.dto';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async paginate(page: number, page_size: number) {
    return await this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.created_by', 'created_by')
      .select([
        'file.id',
        'file.path',
        'file.created_at',
        'file.updated_at',
        'created_by.id',
        'created_by.name',
        'created_by.email',
      ])
      .orderBy('file.created_at', 'DESC')
      .take(page_size)
      .skip((page - 1) * page_size)
      .getManyAndCount();
  }

  async uploadFile(file, user: User): Promise<File> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    const saved_file = await this.fileRepository.create({
      path: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      locale: user.locale,
      created_by: user,
    });

    return this.fileRepository.save(saved_file);
  }

  async findOne(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          file: 'fileNotFound',
        },
      });
    }
    return file;
  }

  async delete(
    id: number,
    deleteFileDto: DeleteFileDto,
    current_user_id: number,
  ) {
    const file = await this.findOne(id);
    file.deleted_reason = deleteFileDto.deleted_reason;
    file.last_update_by = { id: current_user_id } as User;
    file.deleted_by = { id: current_user_id } as User;
    await this.fileRepository.save(file);
    await this.removeFile(file.path);
    return this.fileRepository.softDelete(id);
  }

  private async removeFile(path: string) {
    const file_path = path.split('/');
    const file_name = file_path[file_path.length - 1];
    fs.unlink(__dirname + `/../../../files/${file_name}`, (err) => {
      console.log(err);
    });
  }

  async trash(page: number, page_size: number) {
    return this.fileRepository
      .createQueryBuilder('file')
      .withDeleted()
      .where('file.deleted_at IS NOT NULL')
      .leftJoinAndSelect('file.created_by', 'created_by')
      .leftJoinAndSelect('file.deleted_by', 'deleted_by')
      .take(page_size)
      .skip(page_size * (page - 1))
      .select([
        'file.id',
        'file.path',
        'file.created_at',
        'file.deleted_reason',
        'file.updated_at',
        'file.deleted_at',
        'created_by.id',
        'created_by.name',
        'created_by.email',
        'deleted_by.id',
        'deleted_by.name',
        'deleted_by.email',
      ])
      .orderBy('file.deleted_at', 'DESC')
      .getManyAndCount();
  }
}
