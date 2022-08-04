import { useTranslation } from 'react-i18next';
import { Heading } from 'suomifi-ui-components';
import {
  Contributor,
  Description,
  StatusChip,
  TitleDescriptionWrapper,
  TitleWrapper,
  TitleWrapperNoBreadcrumb,
} from './title.styles';
import InfoExpander from '@app/common/components/info-dropdown/info-expander';
import { VocabularyInfoDTO } from '@app/common/interfaces/vocabulary.interface';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { useStoreDispatch } from '@app/store';
import { setTitle } from './title.slice';
import { useEffect } from 'react';
import { getProperty } from '@app/common/utils/get-property';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import NewTerminology from '@app/modules/new-terminology';
import useTitleRef from '@app/common/utils/hooks/use-title-ref';
import { translateStatus } from '@app/common/utils/translation-helpers';

interface TitleProps {
  info: string | VocabularyInfoDTO;
}

export default function Title({ info }: TitleProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const titleRef = useTitleRef();
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
      <TitleWrapperNoBreadcrumb>
        <Heading variant="h1">{info}</Heading>
        <TitleDescriptionWrapper $isSmall={isSmall}>
          <Description>{t('terminology-search-info')}</Description>
          <NewTerminology />
        </TitleDescriptionWrapper>
      </TitleWrapperNoBreadcrumb>
    );
  } else {
    const status = info.properties.status?.[0].value ?? 'DRAFT';

    const contributor =
      getPropertyValue({
        property: getProperty('prefLabel', info.references.contributor),
        language: i18n.language,
        fallbackLanguage: 'fi',
      }) ?? '';

    return (
      <TitleWrapper>
        <Contributor>{contributor}</Contributor>

        <Heading variant="h1" tabIndex={-1} ref={titleRef}>
          {title}
        </Heading>

        <StatusChip valid={status === 'VALID' ? 'true' : undefined}>
          {translateStatus(status, t)}
        </StatusChip>

        <InfoExpander data={info} />
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
        fallbackLanguage: 'fi',
      }) ?? ''
    );
  }
}
