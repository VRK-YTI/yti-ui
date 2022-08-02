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
import ConceptBasicInformation from './basic-information/concept-basic-information';
import FormFooter from './form-footer';
import { NewConceptBlock, PageHelpText } from './new-concept.styles';
import ConceptTermsBlock from './concept-terms-block';
import { asString } from '@app/common/utils/hooks/useUrlState';
import { useEffect, useState } from 'react';
import generateConcept from './generate-concept';
import { useAddConceptMutation } from '@app/common/components/modify/modify.slice';
import { v4 } from 'uuid';
import {
  BasicInfo,
  NewConceptType,
  ConceptTermType,
} from './new-concept.types';

interface NewConceptProps {
  terminologyId: string;
  conceptNames: { [key: string]: string | undefined };
}

export default function NewConcept({ terminologyId }: NewConceptProps) {
  const { t } = useTranslation('concept');
  const router = useRouter();
  const [addConcept, addConceptStatus] = useAddConceptMutation();
  const { data: terminology } = useGetVocabularyQuery({
    id: terminologyId,
  });

  const [languages] = useState(
    terminology?.properties.language?.map(({ value }) => value) ?? []
  );
  const [preferredTerms] = useState(
    languages
      .map((lang) => ({ lang, value: asString(router.query[lang]), regex: '' }))
      .filter(({ value }) => !!value)
  );
  const [postedData, setPostedData] =
    useState<ReturnType<typeof generateConcept>>();

  const [formData, setFormData] = useState<NewConceptType>({
    terms: preferredTerms.map((term) => ({
      changeNote: '',
      draftComment: '',
      editorialNote: [],
      historyNote: '',
      id: v4(),
      language: term.lang,
      prefLabel: term.value,
      scope: '',
      source: '',
      status: 'draft',
      termConjugation: '',
      termEquivalency: '',
      termEquivalencyRelation: '',
      termFamily: '',
      termHomographNumber: '',
      termInfo: '',
      termStyle: '',
      termType: 'recommended-term',
      wordClass: '',
    })),
    basicInformation: {
      definition: {},
      example: [],
      subject: '',
      note: [],
      diagramAndSource: {
        diagram: [],
        sources: '',
      },
      orgInfo: {
        changeHistory: '',
        editorialNote: [],
        etymology: '',
      },
      otherInfo: {
        conceptClass: '',
        wordClass: '',
      },
      relationalInfo: {
        broaderConcept: [],
        narrowerConcept: [],
        relatedConcept: [],
        isPartOfConcept: [],
        hasPartConcept: [],
        relatedConceptInOther: [],
        matchInOther: [],
      },
    },
  });

  const handlePost = () => {
    if (!terminologyId) {
      console.error('Invalid terminologyId');
      return;
    }

    const concept = generateConcept({
      data: formData,
      terminologyId: terminologyId,
    });
    setPostedData(concept);
    addConcept(concept);
  };

  const updateTerms = (terms: ConceptTermType[]) => {
    setFormData({ ...formData, terms: terms });
  };

  const updateBasicInformation = (basicInfo: BasicInfo) => {
    setFormData({ ...formData, basicInformation: basicInfo });
  };

  useEffect(() => {
    if (addConceptStatus.isSuccess && postedData) {
      router.push(
        `/terminology/${terminologyId}/concept/${
          postedData[postedData.length - 1].id
        }`
      );
    }
  }, [addConceptStatus, postedData, terminologyId, router]);

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
        <PageHelpText>{t('new-concept-page-help')}</PageHelpText>

        <ConceptTermsBlock
          languages={languages}
          updateTerms={updateTerms}
          initialValues={formData.terms}
        />

        <ConceptBasicInformation
          updateBasicInformation={updateBasicInformation}
          initialValues={formData.basicInformation}
          languages={languages}
        />

        <FormFooter handlePost={handlePost} />
      </NewConceptBlock>
    </>
  );
}
