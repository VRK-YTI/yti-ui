import { PipeTransform, Pipe } from '@angular/core';
import { isDefined } from '../utils/object';
import * as removeMd from 'remove-markdown';

@Pipe({ name: 'stripMarkdown' })
export class StripMarkdownPipe implements PipeTransform {

  transform(value: string): string {
    if (isDefined(value)) {
      return removeMd(StripMarkdownPipe.sanitize(value));
    } else {
      return value;
    }
  }

  static sanitize(markdown: string) {
    // FIXME: Hack, goes around problem in remove-markdown library
    return markdown.replace(')[', ') [');
  }
}
