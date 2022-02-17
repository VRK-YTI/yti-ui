import { useTranslation } from 'react-i18next';
import { Heading } from 'suomifi-ui-components';
import { Contributor, Description, StatusChip, TitleDescriptionWrapper, TitleWrapper, TitleWrapperNoBreadcrumb } from './title.styles';
import InfoExpander from '../info-dropdown/info-expander';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import { useBreakpoints } from '../media-query/media-query-context';
import NewTerminology from '../new-terminology';
import { getPropertyValue } from '../property-value/get-property-value';

interface TitleProps {
  info: string | VocabularyInfoDTO;
}

export default function Title({ info }: TitleProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();

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
    const title = getPropertyValue({
      property: info.properties.prefLabel,
      language: i18n.language,
      fallbackLanguage: 'fi'
    }) ?? '';
    const contributor = getPropertyValue({
      property: info.references.contributor?.[0].properties.prefLabel,
      language: i18n.language,
      fallbackLanguage: 'fi'
    }) ?? '';

    return (
      <TitleWrapper>
        <Contributor>{contributor}</Contributor>

        <Heading variant='h1'>{title}</Heading>

        <StatusChip valid={status === 'VALID' ? 'true' : undefined}>
          {t(`${status}`)}
        </StatusChip>

        <InfoExpander data={info} />
      </TitleWrapper>
    );
  }
}
