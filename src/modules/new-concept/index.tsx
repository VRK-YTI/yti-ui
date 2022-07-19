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
import FormFooter from './form-footer';
import { NewConceptBlock } from './new-concept.styles';
import ConceptTermsBlock from './concept-terms-block';
import { asString } from '@app/common/utils/hooks/useUrlState';
import { useState } from 'react';
import generateConcept from './generate-concept';
import { useAddConceptMutation } from '@app/common/components/modify/modify.slice';

interface NewConceptProps {
  terminologyId: string;
  conceptNames: { [key: string]: string | undefined };
}

export default function NewConcept({ terminologyId }: NewConceptProps) {
  const { t } = useTranslation('concept');
  const router = useRouter();
  const [addConcept] = useAddConceptMutation();
  const { data: terminology } = useGetVocabularyQuery({
    id: terminologyId,
  });

  const [formData, setFormData] = useState({
    terms: [],
    basicInformation: {},
  });

  const HandlePost = () => {
    const concept = generateConcept(formData);
    console.log(concept);
    addConcept(concept);
  };

  const updateTerms = (terms: any) => {
    setFormData({ ...formData, terms: terms });
  };

  const updateBasicInformation = (basicInfo: any) => {
    console.log(basicInfo);
    setFormData({ ...formData, basicInformation: basicInfo });
  };

  const languages =
    terminology?.properties.language?.map(({ value }) => value) ?? [];
  const preferredTerms = languages
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
        {!!preferredTerms?.length && (
          <BreadcrumbLink url="" current>
            <PropertyValue property={preferredTerms} fallbackLanguage="fi" />
          </BreadcrumbLink>
        )}
      </Breadcrumb>

      <NewConceptBlock variant="main" id="main">
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
          <PropertyValue property={preferredTerms} fallbackLanguage="fi" />
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

        <ConceptTermsBlock
          languages={languages}
          preferredTerms={preferredTerms}
          updateTerms={updateTerms}
        />

        <ConceptBasicInformation
          updateBasicInformation={updateBasicInformation}
        />

        <FormFooter handlePost={HandlePost} />
      </NewConceptBlock>
    </>
  );
}
