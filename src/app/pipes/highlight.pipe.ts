import { PipeTransform, Pipe } from '@angular/core';
import { createSearchRegex } from '../utils/regex';

/* FIXME: Pipe produces HTML output which has to be bound with innerHTML-attribute in the template.
          Malicious user input cannot be sanitized with this mechanism and it causes security problems.
          Angular 1 had $sce service which allowed trusting of html content partially and angular 2 doesn't have on yer.
*/

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: string): string {
    return applyHighlight(text, search);
  }
}

function applyHighlight(text: string, search: string): string {
  if (!text || !search || search.length === 0) {
    return text;
  } else {
    return text.replace(createSearchRegex(search), '<span class="highlight">$1</span>');
  }
}
