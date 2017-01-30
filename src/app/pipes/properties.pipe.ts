import { PipeTransform, Pipe } from '@angular/core';
import { Node, Property } from '../entities/node';
import { comparingNumber } from '../utils/comparator';
import { normalizeAsArray, any } from '../utils/array';

@Pipe({ name: 'properties' })
export class PropertiesPipe implements PipeTransform {

  transform(obj: Node<any>, rejectTypes?: string[]): Property[] {

    const rejects = normalizeAsArray(rejectTypes);
    const properties = Object.values(obj.properties).filter(property => !any(rejects, reject => property.meta.id === reject));

    properties.sort(comparingNumber<Property>(property => property.meta.index));
    return properties;
  }
}
