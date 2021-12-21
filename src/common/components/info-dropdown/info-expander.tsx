import { useTranslation } from 'react-i18next';
import { Button, ExpanderContent, ExpanderTitleButton } from 'suomifi-ui-components';
import FormatISODate from '../../utils/format-iso-date';
import { InfoExpanderWrapper, InfoExpanderDivider } from './info-expander.styles';
import InfoBlock from './info-block';
import InfoBasic from './info-basic';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import { InfoBasicExtraWrapper } from './info-basic.styles';
import { getPropertyValue } from '../property-value/get-property-value';

interface InfoExpanderProps {
  data?: VocabularyInfoDTO;
}

export default function InfoExpander({ data }: InfoExpanderProps) {
  const { t } = useTranslation('common');

  if (!data) {
    return null;
  }

  return (
    <InfoExpanderWrapper>
      <ExpanderTitleButton>
        {t('vocabulary-info-terminology')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <InfoBlock
          title={t('vocabulary-info-name')}
          data={data.properties.prefLabel}
        />
        <InfoBlock
          title={t('vocabulary-info-description')}
          data={data.properties.description}
        />
        <InfoBasic
          title={t('vocabulary-info-information-domain')}
          data={getPropertyValue({
            property: data.references.inGroup?.[0]?.properties.prefLabel,
          })}
        />
        <InfoBasic
          title={t('vocabulary-info-languages')}
          data={getPropertyValue({
            property: data.properties.language,
            delimiter: ', ',
            valueAccessor: ({ value }) => `${t(`vocabulary-info-${value}`)} ${value.toUpperCase()}`,
          })}
        />
        <InfoBasic
          title={t('vocabulary-info-vocabulary-type')}
          data={t('vocabulary-info-terminological-dictionary')}
        />

        <InfoExpanderDivider />

        <InfoBasic
          title={t('vocabulary-info-vocabulary-export')}
          data={t('vocabulary-info-vocabulary-export-description')}
          extra={
            <InfoBasicExtraWrapper>
              <Button
                icon="download"
                variant="secondary"
                onClick={() => {
                  window.open(`/terminology-api/api/v1/export/${data.type.graph.id}?format=xlsx`, '_blank');
                }}
              >
                {t('vocabulary-info-vocabulary-export')}
              </Button>
            </InfoBasicExtraWrapper>
          }
        />

        <InfoExpanderDivider />

        <InfoBasic
          title={t('vocabulary-info-organization')}
          data={getPropertyValue({
            property: data.references.contributor?.[1]?.properties.prefLabel,
          })}
        />
        <InfoBasic
          title={t('vocabulary-info-created-at')}
          data={FormatISODate(data.createdDate)}
        />
        <InfoBasic
          title={t('vocabulary-info-modified-at')}
          data={FormatISODate(data.lastModifiedDate)}
        />
        <InfoBasic
          title={'URI'}
          data={data.uri}
        />
      </ExpanderContent>
    </InfoExpanderWrapper>
  );
}
