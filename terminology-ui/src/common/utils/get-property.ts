import { Organization } from '@app/common/interfaces/organization.interface';
import { Term } from '@app/common/interfaces/term.interface';
import { Property } from '@app/common/interfaces/termed-data-types.interface';

export function getProperty(
  propertyName: keyof Term['properties'],
  items?: Term[]
): Property[];

export function getProperty(
  propertyName: keyof Organization['properties'],
  items?: Organization[]
): Property[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProperty(propertyName: string, items?: any[]) {
  if (!items?.length) {
    return [];
  }

  return items
    ?.flatMap((item) => item.properties[propertyName])
    .filter((item): item is Property => !!item);
}
