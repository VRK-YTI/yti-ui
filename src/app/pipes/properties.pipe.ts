import { PipeTransform, Pipe } from '@angular/core';
import { Node, Property } from '../entities/node';
import { comparingPrimitive } from '../utils/comparator';
import { normalizeAsArray, anyMatching } from '../utils/array';

@Pipe({ name: 'properties' })
export class PropertiesPipe implements PipeTransform {

  transform(obj: Node<any>, showEmpty = true, rejectTypes?: string[]): Property[] {

    const rejects = normalizeAsArray(rejectTypes);
    const properties = Object.values(obj.properties).filter(property => (showEmpty || !property.empty) && !anyMatching(rejects, reject => property.meta.id === reject));

    properties.sort(comparingPrimitive<Property>(property => property.meta.index));
    return properties;
  }
}
