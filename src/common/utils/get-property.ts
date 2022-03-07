import { Organization } from '../interfaces/organization.interface';
import { Term } from '../interfaces/term.interface';
import { Property } from '../interfaces/termed-data-types.interface';

export function getProperty(
  propertyName: keyof Term['properties'],
  items?: Term[]
): Property[];

export function getProperty(
  propertyName: keyof Organization['properties'],
  items?: Organization[]
): Property[];

export function getProperty(propertyName: string, items?: any[]) {
  if (!items?.length) {
    return [];
  }

  return items
    ?.flatMap(item => item.properties[propertyName])
    .filter((item): item is Property => !!item);
}
