import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'entries' })
export class EntriesPipe implements PipeTransform {
  transform(obj: { [key: string]: string }): {key: string, value: string}[] {
    return Object.entries(obj).map(entry => {
      return { key: entry[0], value: entry[1] };
    });
  }
}
