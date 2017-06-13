import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {

  transform(obj: { [key: string]: any} ): string[] {

    if (!obj) {
      return [];
    }

    return Object.keys(obj);
  }
}
