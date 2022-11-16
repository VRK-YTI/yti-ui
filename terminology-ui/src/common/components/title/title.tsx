import { useTranslation } from 'react-i18next';
import { Heading } from 'suomifi-ui-components';
import {
  Description,
  StatusChip,
  TitleDescriptionWrapper,
  TitleType,
  TitleTypeAndStatusWrapper,
  TitleWrapper,
  TitleWrapperNoBreadcrumb,
} from './title.styles';
import InfoExpander from '@app/common/components/info-dropdown/info-expander';
import { VocabularyInfoDTO } from '@app/common/interfaces/vocabulary.interface';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { useStoreDispatch } from '@app/store';
import { setTitle } from './title.slice';
import { useEffect } from 'react';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import NewTerminology from '@app/modules/new-terminology';
import {
  translateStatus,
  translateTerminologyType,
} from '@app/common/utils/translation-helpers';

interface TitleProps {
  info: string | VocabularyInfoDTO;
  noExpander?: boolean;
}

export default function Title({ info, noExpander }: TitleProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const title = getTitle(info);

  useEffect(() => {
    dispatch(setTitle(title));
  }, [dispatch, title]);

  if (!info) {
    return <></>;
  }

  if (typeof info === 'string') {
    return (
      <TitleWrapperNoBreadcrumb id="page-title-block">
        <Heading variant="h1" id="page-title">
          {info}
        </Heading>
        <TitleDescriptionWrapper $isSmall={isSmall}>
          <Description id="page-description">
            {t('terminology-search-info')}
          </Description>
          <NewTerminology />
        </TitleDescriptionWrapper>
      </TitleWrapperNoBreadcrumb>
    );
  } else {
    const status = info.properties.status?.[0].value ?? 'DRAFT';
    const terminologyType =
      info.properties.terminologyType?.[0].value ?? 'TERMINOLOGICAL_VOCABULARY';

    return (
      <TitleWrapper id="page-title-block">
        <Heading variant="h1" tabIndex={-1} id="page-title">
          {title}
        </Heading>

        <TitleTypeAndStatusWrapper>
          <TitleType>{translateTerminologyType(terminologyType, t)}</TitleType>{' '}
          &middot;
          <StatusChip
            valid={status === 'VALID' ? 'true' : undefined}
            id="status-chip"
          >
            {translateStatus(status, t)}
          </StatusChip>
        </TitleTypeAndStatusWrapper>

        {!noExpander && <InfoExpander data={info} />}
      </TitleWrapper>
    );
  }

  function getTitle(info: string | VocabularyInfoDTO) {
    if (typeof info === 'string') {
      return info;
    }

    return (
      getPropertyValue({
        property: info.properties.prefLabel,
        language: i18n.language,
      }) ?? ''
    );
  }
}
