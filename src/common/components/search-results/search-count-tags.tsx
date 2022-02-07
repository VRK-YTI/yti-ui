import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GroupSearchResult,
  OrganizationSearchResult
} from '../../interfaces/terminology.interface';
import useUrlState, { initialUrlState } from '../../utils/hooks/useUrlState';
import { useBreakpoints } from '../media-query/media-query-context';
import PropertyValue from '../property-value';
import {
  ChipWrapper,
  CountText,
  CountWrapper
} from './search-count-tags.styles';
import Tag from './tag';

interface SearchCountTagsProps {
  title: ReactNode;
  organizations?: OrganizationSearchResult[];
  domains?: GroupSearchResult[];
}

export default function SearchCountTags({
  title,
  organizations = [],
  domains = []
}: SearchCountTagsProps) {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();
  const { isSmall } = useBreakpoints();

  return (
    <CountWrapper isSmall={isSmall}>
      <CountText>{title}</CountText>
      <ChipWrapper>
        {urlState.org && (
          <Tag
            onRemove={() => patchUrlState({
              org: initialUrlState.org,
            })}
          >
            <PropertyValue
              property={organizations.filter(o => o.id === urlState.org)[0]?.properties.prefLabel}
              fallbackLanguage="fi"
              // fallback={urlState.org}
            />
          </Tag>
        )}
        {urlState.q && (
          <Tag
            onRemove={() => patchUrlState({
              q: initialUrlState.q,
            })}
          >
            {urlState.q}
          </Tag>
        )}
        {urlState.status.map(status => (
          <Tag
            onRemove={() => patchUrlState({
              status: urlState.status.filter(s => s !== status),
            })}
            key={status}
          >
            {t(status.toUpperCase())}
          </Tag>
        ))}
        {urlState.domain.map(domain => (
          <Tag
            onRemove={() => patchUrlState({
              domain: urlState.domain.filter(d => d !== domain),
            })}
            key={domain}
          >
            <PropertyValue
              property={domains.filter(d => d.id === domain)[0]?.properties.prefLabel}
              fallbackLanguage="fi"
              // fallback={urlState.org}
            />
          </Tag>
        ))}
      </ChipWrapper >
    </CountWrapper >
  );
}
