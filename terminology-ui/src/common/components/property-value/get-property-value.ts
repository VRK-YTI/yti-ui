import { Property } from '@app/common/interfaces/termed-data-types.interface';

export interface GetPropertyValueParams {
  property?: Property[];
  valueAccessor?: (property: Property) => string;
  language?: string;
  delimiter?: string | false;
  fallback?: string;
  stripHtml?: boolean;
}

export function getPropertyValue({
  property,
  valueAccessor = ({ value }) => value,
  language = '',
  delimiter = false,
  fallback,
  stripHtml = false,
}: GetPropertyValueParams): string {
  const matchingProperties =
    getMatchingProperties(property ?? [], language) ??
    getMatchingProperties(property ?? [], 'fi') ??
    getMatchingProperties(property ?? [], 'en') ??
    getMatchingProperties(property ?? [], 'sv') ??
    getMatchingProperties(property ?? [], '') ??
    [];

  let result;
  if (delimiter !== false) {
    result = matchingProperties.map(valueAccessor).join(delimiter);
  } else {
    result = matchingProperties[0] ? valueAccessor(matchingProperties[0]) : '';
  }

  if (stripHtml) {
    result = result.replace(/(<([^>]+)>)/gi, '');
  }

  return result ?? fallback;
}

function getMatchingProperties(properties: Property[], language: string) {
  if (!language && properties.length) {
    return properties;
  }
  const matchingProperties = properties.filter(({ lang }) => lang === language);

  if (matchingProperties.length) {
    return matchingProperties;
  }
}
