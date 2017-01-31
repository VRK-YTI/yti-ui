import { PipeTransform, Pipe } from '@angular/core';
import { Moment } from 'moment';

@Pipe({ name: 'timestamp' })
export class TimestampPipe implements PipeTransform {

  transform(obj: Moment): string {
    if (obj) {
      // TODO localization
      return obj.format('DD.MM.YYYY HH:mm');
    } else {
      return '';
    }
  }
}
