import { PipeTransform, Pipe } from '@angular/core';
import {isDefined} from "../utils/object";

@Pipe({ name: 'stripMarkdown' })
export class StripMarkdownPipe implements PipeTransform {

  transform(value: string): string {
    let removeMd = require('remove-markdown');
    let retVal = value;
    if (isDefined(value)) {
      value = value.replace(')[', ') [');
      retVal = removeMd(value);
    }
    return retVal;
  }
}
