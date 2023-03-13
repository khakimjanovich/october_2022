import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Language } from './entities/language.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private languagesRepository: Repository<Language>,
  ) {}

  findAll() {
    return this.languagesRepository.find();
  }

  async findOneByLocale(locale: string) {
    const language = await this.languagesRepository.findOne({
      where: { locale },
    });
    if (!language) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          locale: 'languages.notFound',
        },
      });
    }
    return language;
  }
}
