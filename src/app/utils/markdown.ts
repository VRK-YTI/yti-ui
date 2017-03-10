import { isDefined } from './object';
import * as removeMd from 'remove-markdown';

export function stripMarkdown(mdString: string): string {
  if (isDefined(mdString)) {
    return removeMd(sanitize(mdString));
  } else {
    return mdString;
  }
}

function sanitize(markdown: string) {
  // FIXME: Hack, goes around problem in remove-markdown library
  return markdown.replace(')[', ') [');
}