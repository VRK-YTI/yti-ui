import { useTranslation } from 'react-i18next';
import { Heading } from 'suomifi-ui-components';
import { StatusTag, TitleWrapper } from './vocabulary-title.styles';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';

interface VocabularyTitleProps {
  data: VocabularyInfoDTO;
}

export default function VocabularyTitle({ data }: VocabularyTitleProps) {
  const { t, i18n } = useTranslation('common');

  const status = t(`${data.properties.status[0]?.value}`).toUpperCase() ?? '';

  const vocabulary = data.properties.prefLabel?.map((pLabel: any) => {
    if (pLabel.lang === i18n.language) {
      return (
        pLabel.value
      );
    }
  }) ?? '';

  const contributor = data.references.contributor[0]?.properties.prefLabel.map((d: any) => {
    if (d.lang === i18n.language) {
      return (
        d.value
      );
    }
  }) ?? '';

  return (
    <TitleWrapper>
      <Heading variant='h3'>
        {contributor}
      </Heading>

      <Heading variant='h1'>
        {vocabulary}
      </Heading>

      <StatusTag isValid={data.properties.status[0].value === 'VALID' ? true : false}>
        {status}
      </StatusTag>

    </TitleWrapper>
  );
}
