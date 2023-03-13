import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageSeedService } from './language-seed.service';
import { Language } from '../../../modules/languages/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguageSeedService],
  exports: [LanguageSeedService],
})
export class LanguageSeedModule {}
