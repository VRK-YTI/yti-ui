import { PipeTransform, Pipe } from '@angular/core';
import { Node, Reference } from '../entities/node';
import { comparingPrimitive } from '../utils/comparator';
import { any, normalizeAsArray } from '../utils/array';

@Pipe({ name: 'references' })
export class ReferencesPipe implements PipeTransform {

  transform(obj: Node<any>, showEmpty = true, rejectTypes?: string[]): Reference<any>[] {

    const rejects = normalizeAsArray(rejectTypes);
    const references = Object.values(obj.references).filter(reference => (showEmpty || !reference.empty) && !any(rejects, reject => reference.meta.id === reject));

    references.sort(comparingPrimitive<Reference<any>>(reference => reference.meta.index));
    return references;
  }
}
