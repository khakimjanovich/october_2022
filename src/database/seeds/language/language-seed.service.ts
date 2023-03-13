import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../../../modules/languages/entities/language.entity';
import { LanguagesEnum } from '../../../modules/languages/languages.enum';

@Injectable()
export class LanguageSeedService {
  constructor(
    @InjectRepository(Language)
    private repository: Repository<Language>,
  ) {}

  async run() {
    const countEnglish = await this.repository.count({
      where: {
        locale: LanguagesEnum.en,
      },
    });

    if (countEnglish === 0) {
      await this.repository.save(
        this.repository.create({
          locale: LanguagesEnum.en,
          label: 'English',
        }),
      );
    }
    const countUzbek = await this.repository.count({
      where: {
        locale: LanguagesEnum.uz,
      },
    });

    if (countUzbek === 0) {
      await this.repository.save(
        this.repository.create({
          locale: LanguagesEnum.uz,
          label: `O'zbekcha`,
        }),
      );
    }

    const countRussian = await this.repository.count({
      where: {
        locale: LanguagesEnum.ru,
      },
    });

    if (countRussian === 0) {
      await this.repository.save(
        this.repository.create({
          locale: LanguagesEnum.ru,
          label: 'Русский',
        }),
      );
    }
  }
}
