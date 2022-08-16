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
import {
  BasicInfo,
  EditConceptType,
  ConceptTermType,
} from './new-concept.types';
import { Concept } from '@app/common/interfaces/concept.interface';
import generateFormData from './generate-form-data';
import { useSelector } from 'react-redux';
import { selectLogin } from '@app/common/components/login/login.slice';
import { Notification, Paragraph, Text } from 'suomifi-ui-components';
import useConfirmBeforeLeavingPage from '@app/common/utils/hooks/use-confirm-before-leaving-page';

interface EditConceptProps {
  terminologyId: string;
  conceptData?: Concept;
}

export default function EditConcept({
  terminologyId,
  conceptData,
}: EditConceptProps) {
  const { t } = useTranslation('concept');
  const router = useRouter();
  const [addConcept, addConceptStatus] = useAddConceptMutation();
  const user = useSelector(selectLogin());
  const { data: terminology } = useGetVocabularyQuery({
    id: terminologyId,
  });

  const [languages] = useState(
    terminology?.properties.language?.map(({ value }) => value) ?? []
  );

  const [preferredTerms] = useState<
    {
      lang: string;
      regex: string;
      value: string;
    }[]
  >(getPreferredTerms());
  const { disableConfirmation, enableConfirmation } =
    useConfirmBeforeLeavingPage(
      preferredTerms.length > 0 && !conceptData ? 'enabled' : 'disabled'
    );

  const [postedData, setPostedData] =
    useState<ReturnType<typeof generateConcept>>();

  const [formData, setFormData] = useState<EditConceptType>(
    generateFormData(
      preferredTerms,
      conceptData,
      terminology?.properties.prefLabel
    )
  );

  const handlePost = () => {
    if (!terminologyId) {
      console.error('Invalid terminologyId');
      return;
    }

    const concept = generateConcept({
      data: formData,
      terminologyId: terminologyId,
      initialValue: conceptData,
      lastModifiedBy: `${user.firstName} ${user.lastName}`,
    });

    setPostedData(concept);
    addConcept(concept);
    disableConfirmation();
  };

  const updateTerms = (terms: ConceptTermType[]) => {
    setFormData({ ...formData, terms: terms });
    enableConfirmation();
  };

  const updateBasicInformation = (basicInfo: BasicInfo) => {
    setFormData({ ...formData, basicInformation: basicInfo });
    enableConfirmation();
  };

  useEffect(() => {
    if (addConceptStatus.isSuccess && postedData) {
      router.replace(
        `/terminology/${terminologyId}/concept/${
          postedData[postedData.length - 1].id
        }`
      );
    }
  }, [addConceptStatus, postedData, terminologyId, router]);

  if (preferredTerms.length < 1) {
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
          <BreadcrumbLink url="" current>
            ...
          </BreadcrumbLink>
        </Breadcrumb>

        <main id="main">
          <Notification
            closeText={t('close')}
            headingText={t('error-not-found', {
              context: 'new-concept',
              ns: 'common',
            })}
            status="error"
            onCloseButtonClick={() =>
              router.push(`/terminology/${terminologyId}`)
            }
            id="error-notification"
          >
            <Paragraph>
              <Text smallScreen>
                {t('error-not-found-desc', {
                  context: 'new-concept',
                  ns: 'common',
                })}
              </Text>
            </Paragraph>
          </Notification>
        </main>
      </>
    );
  }

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
          <Badge>{t('statuses.draft', { ns: 'common' })}</Badge>
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

        <FormFooter
          handlePost={handlePost}
          onCancel={disableConfirmation}
          isEdit={typeof conceptData !== 'undefined'}
        />
      </NewConceptBlock>
    </>
  );

  function getPreferredTerms(): {
    lang: string;
    regex: string;
    value: string;
  }[] {
    const temp = conceptData?.references?.prefLabelXl?.flatMap((label) =>
      label.properties.prefLabel?.flatMap((l) => ({
        lang: l.lang,
        regex: '',
        value: l.value,
      }))
    );

    if (temp && !temp.some((t) => t === undefined)) {
      return temp as ReturnType<typeof getPreferredTerms>;
    }

    return languages
      .map((lang) => ({ lang, value: asString(router.query[lang]), regex: '' }))
      .filter(({ value }) => !!value);
  }
}
