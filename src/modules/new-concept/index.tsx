import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import {
  MainTitle,
  SubTitle,
  BadgeBar,
  Badge,
} from '@app/common/components/title-block';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { getProperty } from '@app/common/utils/get-property';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Text } from 'suomifi-ui-components';
import ConceptBasicInformation from './basic-information/concept-basic-information';
import { NewConceptBlock } from './new-concept.styles';
import ConceptTermsBlock from './concept-terms-block';
import { asString } from '@app/common/utils/hooks/useUrlState';

interface NewConceptProps {
  terminologyId: string;
  conceptNames: { [key: string]: string | undefined };
}

export default function NewConcept({ terminologyId }: NewConceptProps) {
  const { t } = useTranslation('concept');
  const router = useRouter();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  const languages =
    terminology?.properties.language?.map(({ value }) => value) ?? [];
  const preferredTerm = languages
    .map((lang) => ({ lang, value: asString(router.query[lang]), regex: '' }))
    .filter(({ value }) => !!value);

  return (
    <>
      <Breadcrumb>
        {router.query.terminologyId && (
          <BreadcrumbLink url={`/terminology/${router.query.terminologyId}`}>
            <PropertyValue
              property={terminology?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </BreadcrumbLink>
        )}
        {!!preferredTerm?.length && (
          <BreadcrumbLink url="" current>
            <PropertyValue property={preferredTerm} fallbackLanguage="fi" />
          </BreadcrumbLink>
        )}
      </Breadcrumb>

      <NewConceptBlock>
        <SubTitle>
          <PropertyValue
            property={getProperty(
              'prefLabel',
              terminology?.references.contributor
            )}
            fallbackLanguage="fi"
          />
        </SubTitle>
        <MainTitle>
          <PropertyValue property={preferredTerm} fallbackLanguage="fi" />
        </MainTitle>
        <BadgeBar>
          {t('heading')}
          <PropertyValue
            property={terminology?.properties.prefLabel}
            fallbackLanguage="fi"
          />
          <Badge>{t('DRAFT')}</Badge>
        </BadgeBar>
        <Text>{t('new-concept-page-help')}</Text>

        <ConceptTermsBlock languages={languages} />

        <ConceptBasicInformation />
      </NewConceptBlock>
    </>
  );
}
