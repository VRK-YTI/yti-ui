import { useTranslation } from 'next-i18next';
import { Text, VisuallyHidden } from 'suomifi-ui-components';
import useUrlState, { initialUrlState } from '../../utils/hooks/use-url-state';
import { useBreakpoints } from '../media-query';
import {
  ChipWrapper,
  CountText,
  CountWrapper,
} from './search-count-tags.styles';
import Tag from './tag';
import { translateStatus } from '../../utils/translation-helpers';
import { isEqual } from 'lodash';

interface SearchCountTagsProps {
  title: string;
  hiddenTitle: string;
  organizations?: {
    label: string;
    id: string;
  }[];
  domains?: {
    label: string;
    id: string;
  }[];
  types?: {
    label: string;
    id: string;
  }[];
  renderQBeforeStatus?: boolean;
  withDefaultStatuses?: string[];
}

export default function SearchCountTags({
  title,
  organizations = [],
  domains = [],
  types = [],
  renderQBeforeStatus = false,
  hiddenTitle,
  withDefaultStatuses,
}: SearchCountTagsProps) {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();
  const { isSmall } = useBreakpoints();

  return (
    <CountWrapper $isSmall={isSmall} id="result-counts">
      <CountText aria-live="polite" id="result-counts-text">
        <span aria-hidden={true}>{title}</span>
        <VisuallyHidden>{hiddenTitle}</VisuallyHidden>
      </CountText>
      <ChipWrapper id="result-counts-chips">
        {renderOrganizationTag()}
        {renderQBeforeStatus && renderQTag()}
        {renderTypesTags()}
        {renderLanguageTags()}
        {renderStatusTags()}
        {!renderQBeforeStatus && renderQTag()}
        {renderDomainTags()}
        {!withDefaultStatuses && renderNoActiveFilters()}
      </ChipWrapper>
    </CountWrapper>
  );

  function renderNoActiveFilters() {
    // Ignoring type here on purpose
    if (isEqual({ ...urlState, type: '' }, { ...initialUrlState, type: '' })) {
      return (
        <Text style={{ fontSize: '16px', lineHeight: '0' }}>
          {t('no-filters')}
        </Text>
      );
    }
  }

  function renderOrganizationTag() {
    if (urlState.organization) {
      return (
        <Tag
          onRemove={() =>
            patchUrlState({ organization: initialUrlState.organization })
          }
        >
          {
            organizations.filter((o) => o.id === urlState.organization)[0]
              ?.label
          }
        </Tag>
      );
    }
  }

  function renderQTag() {
    if (urlState.q) {
      return (
        <Tag onRemove={() => patchUrlState({ q: initialUrlState.q })}>
          {urlState.q}
        </Tag>
      );
    }
  }

  function renderStatusTags() {
    if (
      urlState.status.length === 0 &&
      withDefaultStatuses &&
      withDefaultStatuses.length > 0
    ) {
      return (
        <>
          {withDefaultStatuses.map((status) => {
            return (
              <Tag
                key={status}
                onRemove={() => {
                  patchUrlState({
                    status: withDefaultStatuses.filter(
                      (s) => s !== status && s !== status.toUpperCase()
                    ),
                  });
                }}
              >
                {translateStatus(status, t)}
              </Tag>
            );
          })}
        </>
      );
    }

    return ['valid', 'draft', 'retired', 'superseded', 'invalid', 'suggested']
      .map((status) => {
        if (
          urlState.status.includes(status) ||
          urlState.status.includes(status.toUpperCase())
        ) {
          return (
            <Tag
              onRemove={() =>
                patchUrlState({
                  status: urlState.status.filter(
                    (s) => s !== status && s !== status.toUpperCase()
                  ),
                })
              }
              key={status}
            >
              {translateStatus(status.toUpperCase(), t)}
            </Tag>
          );
        }
      })
      .filter(Boolean);
  }

  function renderDomainTags() {
    return domains
      .map((domain) => {
        if (urlState.domain.includes(domain.id)) {
          return (
            <Tag
              onRemove={() =>
                patchUrlState({
                  domain: urlState.domain.filter((d) => d !== domain.id),
                })
              }
              key={domain.id}
            >
              {domain.label}
            </Tag>
          );
        }
      })
      .filter(Boolean);
  }

  function renderLanguageTags() {
    if (urlState.lang) {
      return (
        <Tag
          onRemove={() =>
            patchUrlState({
              lang: '',
            })
          }
          key={urlState.lang}
        >
          {urlState.lang}
        </Tag>
      );
    }
  }

  function renderTypesTags() {
    return types
      .map((type) => {
        if (urlState.types.includes(type.id)) {
          return (
            <Tag
              onRemove={() =>
                patchUrlState({
                  types: urlState.types.filter((t) => t !== type.id),
                })
              }
              key={type.id}
            >
              {type.label}
            </Tag>
          );
        }
      })
      .filter(Boolean);
  }
}
