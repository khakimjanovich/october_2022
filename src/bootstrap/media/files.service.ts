import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async paginate(query: { page: number; page_size: number }) {
    const page: number = +query.page || 1;
    const page_size: number = +query.page_size || 10;

    const [data, count] = await this.fileRepository.findAndCount({
      order: {
        created_at: 'DESC',
      },
      skip: (page - 1) * page_size,
      take: page_size,
    });

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  async uploadFile(file, email: string): Promise<File> {
    if (!file) {
      throw new UnprocessableEntityException({
        file: 'selectFile',
      });
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
    };

    const saved_file = await this.fileRepository.create({
      created_by_email: email,
      path: path[this.configService.get('file.driver')],
    });

    return this.fileRepository.save(saved_file);
  }
}
