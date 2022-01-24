import { useTranslation } from 'react-i18next';
import { Heading } from 'suomifi-ui-components';
import { Contributor, Description, StatusChip, TitleDescriptionWrapper, TitleWrapper } from './title.styles';
import InfoExpander from '../info-dropdown/info-expander';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import { Property } from '../../interfaces/termed-data-types.interface';
import { useBreakpoints } from '../media-query/media-query-context';
import NewTerminology from '../new-terminology';

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
      <TitleWrapper>
        <Heading variant='h1'>{info}</Heading>
        <TitleDescriptionWrapper isSmall={isSmall}>
          <Description>{t('terminology-search-info')}</Description>
          <NewTerminology />
        </TitleDescriptionWrapper>
      </TitleWrapper>
    );
  } else {
    const status = info.properties.status?.[0].value ?? '';
    const title = info.properties.prefLabel?.find((pLabel: Property) => {
      if (pLabel.lang === i18n.language) {
        return pLabel;
      }
    })?.value ?? '';

    const contributor = info.references.contributor?.[0].properties.prefLabel?.find((pLabel: Property) => {
      if (pLabel.lang === i18n.language) {
        return pLabel;
      }
    })?.value ?? '';

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
