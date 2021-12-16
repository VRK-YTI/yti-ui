import { useTranslation } from 'react-i18next';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import FormatISODate from '../../utils/format-iso-date';
import { InfoExpanderWrapper, InfoExpanderContentWrapper } from './info-expander.styles';
import InfoBlock from './info-block';
import InfoBasic from './info-basic';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';

interface InfoExpanderProps {
  data?: VocabularyInfoDTO;
}

export default function InfoExpander({ data }: InfoExpanderProps) {
  const { t } = useTranslation('common');

  if (!data) {
    return <></>;
  }

  const title = data.properties.prefLabel ?? [];
  const description = data.properties.description?.[0] ?? '';
  const vocabularyLanguages = data.properties.language ?? '';
  const createdDate = FormatISODate(data.createdDate) ?? '01.01.1970, 00.00';
  const lastModifiedDate = FormatISODate(data.lastModifiedDate) ?? '01.01.1970, 00.00';
  const uri = data.uri ?? '';
  const contributor = data.references.contributor[0].properties.prefLabel ?? '';
  const informationDomains = data.references.inGroup[0].properties.prefLabel ?? '';

  return (
    <InfoExpanderWrapper>
      <ExpanderTitleButton>
        {t('vocabulary-info-terminology')}
      </ExpanderTitleButton>
      <InfoExpanderContentWrapper>
        <InfoBlock title={t('vocabulary-info-name')} data={title} />
        <InfoBlock title={t('vocabulary-info-description')} data={description} />
        <InfoBasic title={t('vocabulary-info-information-domain')} data={informationDomains} />
        <InfoBasic title={t('vocabulary-info-languages')} data={vocabularyLanguages} />
        <InfoBasic title={t('vocabulary-info-vocabulary-type')} data={t('vocabulary-info-terminological-dictionary')} />
        <InfoBasic title={t('vocabulary-info-organization')} data={contributor} />
        <InfoBasic title={t('vocabulary-info-created-at')} data={createdDate} />
        <InfoBasic title={t('vocabulary-info-modified-at')} data={lastModifiedDate} />
        <InfoBasic title={'URI'} data={uri} />
      </InfoExpanderContentWrapper>
    </InfoExpanderWrapper>
  );
}
