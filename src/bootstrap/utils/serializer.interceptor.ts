import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import deepMapObject from './deep-map-object';
import { BackendUser } from '../backend_users/entities/backend_user.entity';
import { User } from '../../modules/users/entities/user.entity';
import {
  backendUserResponseSerializer,
  userResponseSerializer,
} from '../backend_users/backend_user-response.serializer';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        return deepMapObject(data, (value) => {
          if (value.__entity === 'BackendUser') {
            backendUserResponseSerializer(value as BackendUser);
          } else if (value.__entity === 'User') {
            userResponseSerializer(value as User);
          }

          return value;
        });
      }),
    );
  }
}
