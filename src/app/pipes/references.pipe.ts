import { PipeTransform, Pipe } from '@angular/core';
import { Node, Reference } from '../entities/node';
import { comparingNumber } from '../utils/comparator';
import { any, normalizeAsArray } from '../utils/array';

@Pipe({ name: 'references' })
export class ReferencesPipe implements PipeTransform {

  transform(obj: Node<any>, rejectTypes?: string[]): Reference[] {

    const rejects = normalizeAsArray(rejectTypes);
    const references = Object.values(obj.references).filter(reference => !any(rejects, reject => reference.meta.id === reject));

    references.sort(comparingNumber<Reference>(reference => reference.meta.index));
    return references;
  }
}
