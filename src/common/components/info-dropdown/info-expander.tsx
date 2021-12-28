import { useTranslation } from 'react-i18next';
import { Button, ExpanderContent, ExpanderTitleButton } from 'suomifi-ui-components';
import FormatISODate from '../../utils/format-iso-date';
import { InfoExpanderWrapper } from './info-expander.styles';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import { getPropertyValue } from '../property-value/get-property-value';
import Separator from '../separator';
import { BasicBlock, PropertyBlock } from '../block';
import { BasicBlockExtraWrapper } from '../block/block.styles';

interface InfoExpanderProps {
  data?: VocabularyInfoDTO;
}

export default function InfoExpander({ data }: InfoExpanderProps) {
  const { t, i18n } = useTranslation('common');

  if (!data) {
    return null;
  }

  return (
    <InfoExpanderWrapper>
      <ExpanderTitleButton>
        {t('vocabulary-info-terminology')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <PropertyBlock
          title={t('vocabulary-info-name')}
          data={data.properties.prefLabel}
        />
        <PropertyBlock
          title={t('vocabulary-info-description')}
          data={data.properties.description}
        />
        <BasicBlock
          title={t('vocabulary-info-information-domain')}
          data={getPropertyValue({
            property: data.references.inGroup?.[0]?.properties.prefLabel,
            language: i18n.language,
            fallbackLanguage: 'fi',
          })}
        />
        <BasicBlock
          title={t('vocabulary-info-languages')}
          data={getPropertyValue({
            property: data.properties.language,
            delimiter: ', ',
            valueAccessor: ({ value }) => `${t(`vocabulary-info-${value}`)} ${value.toUpperCase()}`,
          })}
        />
        <BasicBlock
          title={t('vocabulary-info-vocabulary-type')}
          data={t('vocabulary-info-terminological-dictionary')}
        />

        <Separator large />

        <BasicBlock
          title={t('vocabulary-info-vocabulary-export')}
          data={t('vocabulary-info-vocabulary-export-description')}
          extra={
            <BasicBlockExtraWrapper>
              <Button
                icon="download"
                variant="secondary"
                onClick={() => {
                  window.open(`/terminology-api/api/v1/export/${data.type.graph.id}?format=xlsx`, '_blank');
                }}
              >
                {t('vocabulary-info-vocabulary-export')}
              </Button>
            </BasicBlockExtraWrapper>
          }
        />

        <Separator large />

        <BasicBlock
          title={t('vocabulary-info-organization')}
          data={getPropertyValue({
            property: data.references.contributor?.[0]?.properties.prefLabel,
            language: i18n.language,
            fallbackLanguage: 'fi',
          })}
        />
        <BasicBlock
          title={t('vocabulary-info-created-at')}
          data={FormatISODate(data.createdDate)}
        />
        <BasicBlock
          title={t('vocabulary-info-modified-at')}
          data={FormatISODate(data.lastModifiedDate)}
        />
        <BasicBlock
          title={'URI'}
          data={data.uri}
        />
      </ExpanderContent>
    </InfoExpanderWrapper>
  );
}
