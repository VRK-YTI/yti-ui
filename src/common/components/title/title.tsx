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
import { useEffect, useRef } from 'react';
import { getProperty } from '@app/common/utils/get-property';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import NewTerminology from '@app/common/components/new-terminology';

interface TitleProps {
  info: string | VocabularyInfoDTO;
}

export default function Title({ info }: TitleProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dispatch = useStoreDispatch();
  const title = getTitle(info);

  useEffect(() => {
    dispatch(setTitle(title));
  }, [dispatch, title]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  if (!info) {
    return <></>;
  }

  if (typeof info === 'string') {
    return (
      <TitleWrapperNoBreadcrumb>
        <Heading variant='h1'>{info}</Heading>
        <TitleDescriptionWrapper isSmall={isSmall}>
          <Description>{t('terminology-search-info')}</Description>
          <NewTerminology />
        </TitleDescriptionWrapper>
      </TitleWrapperNoBreadcrumb>
    );
  } else {
    const status = info.properties.status?.[0].value ?? '';

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
          {t(`${status}`)}
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
