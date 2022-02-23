import { useTranslation } from 'react-i18next';
import { Heading, VisuallyHidden } from 'suomifi-ui-components';
import { Contributor, Description, StatusChip, TitleWrapper, TitleWrapperNoBreadcrumb } from './title.styles';
import InfoExpander from '../info-dropdown/info-expander';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import { getPropertyValue } from '../property-value/get-property-value';
import { useStoreDispatch } from '../../../store';
import { setTitle } from './title.slice';

interface TitleProps {
  info: string | VocabularyInfoDTO;
}

export default function Title({ info }: TitleProps) {
  const { t, i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();

  const title = typeof info === 'string'
    ?
    info
    :
    getPropertyValue({
      property: info.properties.prefLabel,
      language: i18n.language,
      fallbackLanguage: 'fi'
    }) ?? '';

  dispatch(setTitle(title));

  if (!info) {
    return <></>;
  }

  if (typeof info === 'string') {
    return (
      <TitleWrapperNoBreadcrumb>
        <Heading variant='h1'>{info}</Heading>
        <Description>{t('terminology-search-info')}</Description>
      </TitleWrapperNoBreadcrumb>
    );
  } else {
    const status = info.properties.status?.[0].value ?? '';

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
