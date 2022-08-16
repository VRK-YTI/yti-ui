import { Property } from '@app/common/interfaces/termed-data-types.interface';

export interface GetPropertyValueParams {
  property?: Property[];
  valueAccessor?: (property: Property) => string;
  language?: string;
  delimiter?: string | false;
}

export function getPropertyValue({
  property,
  valueAccessor = ({ value }) => value,
  language = '',
  delimiter = false,
}: GetPropertyValueParams): string {
  const matchingProperties =
    getMatchingProperties(property ?? [], language) ??
    getMatchingProperties(property ?? [], 'fi') ??
    getMatchingProperties(property ?? [], 'en') ??
    getMatchingProperties(property ?? [], 'sv') ??
    getMatchingProperties(property ?? [], '') ??
    [];

  if (delimiter !== false) {
    return matchingProperties.map(valueAccessor).join(delimiter);
  } else {
    return matchingProperties[0] ? valueAccessor(matchingProperties[0]) : '';
  }
}

function getMatchingProperties(properties: Property[], language: string) {
  if(!language && properties.length){
    return properties;
  }
  const matchingProperties = properties.filter(({ lang }) => lang === language);

  if (matchingProperties.length) {
    return matchingProperties;
  }
}
