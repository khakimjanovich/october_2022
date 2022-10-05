import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../../validators/is-exists.validator';

export class CreateCrudLogDto {
  @IsNotEmpty()
  @Validate(IsExist, ['Language','locale'], {
    message: 'locale.doesNotExist',
  })
  locale: string;
}
