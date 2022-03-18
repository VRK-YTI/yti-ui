import { Property } from '../../interfaces/termed-data-types.interface';

export interface GetPropertyValueParams {
  property?: Property[];
  valueAccessor?: (property: Property) => string;
  language?: string;
  fallbackLanguage?: string;
  delimiter?: string | false;
}

export function getPropertyValue({
  property,
  valueAccessor = ({ value }) => value,
  language = '',
  fallbackLanguage = '',
  delimiter = false,
}: GetPropertyValueParams): string | undefined {
  const matchingProperties =
    getMatchingProperties(property ?? [], language) ??
    getMatchingProperties(property ?? [], fallbackLanguage) ??
    getMatchingProperties(property ?? [], '') ??
    [];

  if (delimiter !== false) {
    return matchingProperties.map(valueAccessor).join(delimiter);
  } else {
    return matchingProperties[0] ? valueAccessor(matchingProperties[0]) : '';
  }
}

function getMatchingProperties(properties: Property[], language: string) {
  const matchingProperties = properties.filter(({ lang }) => lang === language);

  if (matchingProperties.length) {
    return matchingProperties;
  }
}
