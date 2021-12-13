import { useTranslation } from 'react-i18next';
import { Button, Expander, ExpanderContent, ExpanderTitleButton, Heading, Icon } from 'suomifi-ui-components';
import FormatISODate from '../../utils/format-iso-date';
import {
  DescriptionWrapper,
  HR,
  InformationDomainWrapper,
  NameWrapper,
  SimpleInformationWrapper
} from './vocabulary-info.styles';
import { VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';

interface VocabularyInfoProps {
  data: VocabularyInfoDTO;
}

export default function VocabularyInfo({ data }: VocabularyInfoProps) {
  const { t, i18n } = useTranslation('common');
  const prefLabels = data.properties.prefLabel ?? '';
  const description = data.properties.description?.[0] ?? '';
  const informationDomains = data.references.inGroup ?? '';
  const vocabularyLanguages = data.properties.language ?? '';
  const createdDate = FormatISODate(data.createdDate) ?? '01.01.1970, 00.00';
  const lastModifiedDate = FormatISODate(data.lastModifiedDate) ?? '01.01.1970, 00.00';
  const uri = data.uri ?? '';
  const contributor = data.references.contributor?.[0].properties.prefLabel?.map((pLabel: any) => {
    if (pLabel.lang === i18n.language) {
      return (pLabel.value);
    }
  }) ?? '';

  return (
    <Expander>
      <ExpanderTitleButton>
        {t('vocabulary-info-terminology')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <NameWrapper>
          <Heading variant='h4'>{t('vocabulary-info-name')}</Heading>
          <ul>
            {prefLabels.map((prefLabel: any) => {
              return (
                <li key={`prefLabel-${prefLabel.lang}`}>
                  <b>{prefLabel.lang.toUpperCase()}</b>
                  {prefLabel.value}
                </li>
              );
            })}
          </ul>
        </NameWrapper>

        {description &&
          <DescriptionWrapper>
            <Heading variant='h4'>{t('vocabulary-info-description')}</Heading>
            <div>
              <b>{description.lang?.toUpperCase()}</b>
              {description.value}
            </div>
          </DescriptionWrapper>
        }


        <InformationDomainWrapper>
          <Heading variant='h4' style={{ paddingBottom: '6px' }}>
            {t('vocabulary-info-information-domain')}
          </Heading>
          {informationDomains.map((infoDomain: any) => {
            return (
              <div key={`info-domain-${infoDomain.properties.notation[0].value}`}>
                {infoDomain.properties.prefLabel.map((pLabel: any) => {
                  if (pLabel.lang === i18n.language) {
                    return (pLabel.value);
                  }
                })}
              </div>
            );
          })}
        </InformationDomainWrapper>

        <SimpleInformationWrapper>
          <Heading variant='h4'>{t('vocabulary-info-languages')}</Heading>
          <div>{vocabularyLanguages.map((lang: any, idx: number) => {
            if (idx === 0) {
              return (
                <span key={`lang-${lang.value}`}>
                  {t(`vocabulary-info-${lang.value}`)} {lang.value.toUpperCase()}
                </span>
              );
            } else {
              return (
                <span key={`lang-${lang.value}`}>
                  , {t(`vocabulary-info-${lang.value}`)} {lang.value.toUpperCase()}
                </span>
              );
            }
          })}
          </div>
        </SimpleInformationWrapper>

        <SimpleInformationWrapper>
          <Heading variant='h4'>{t('vocabulary-info-vocabulary-type')}</Heading>
          <div>{t('vocabulary-info-terminological-dictionary')}</div>
        </SimpleInformationWrapper>

        <HR />

        <SimpleInformationWrapper>
          <Heading variant='h4'>{t('vocabulary-info-vocabulary-export')}</Heading>
          <div>{t('vocabulary-info-vocabulary-export-description')}</div>
          <Button
            icon="download"
            variant="secondary"
            onClick={() => {
              window.open(`/terminology-api/api/v1/export/${data.type.graph.id}?format=xlsx`, '_blank');
            }}
          >
            {t('vocabulary-info-vocabulary-export')}
          </Button>
        </SimpleInformationWrapper>

        <HR />

        <SimpleInformationWrapper>
          <Heading variant='h4'>{t('vocabulary-info-organization')}</Heading>
          <div>{contributor}</div>
        </SimpleInformationWrapper>

        {/* TODO: Need to check what other organizations are */}
        {/* {data.references.contributor.length > 1 &&
          <SimpleInformationWrapper>
            <Heading variant='h4'>Muut vastuuorganisaatiot</Heading>
            <div></div>
          </SimpleInformationWrapper>
        } */}

        <SimpleInformationWrapper>
          <Heading variant='h4'>{t('vocabulary-info-created-at')}</Heading>
          <div>{createdDate}</div>
        </SimpleInformationWrapper>

        <SimpleInformationWrapper>
          <Heading variant='h4'>{t('vocabulary-info-modified-at')}</Heading>
          <div>{lastModifiedDate}</div>
        </SimpleInformationWrapper>

        <SimpleInformationWrapper>
          <Heading variant='h4'>URI</Heading>
          <div>{uri}</div>
        </SimpleInformationWrapper>
      </ExpanderContent>
    </Expander>
  );
}
