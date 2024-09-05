import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import { MainTitle, SubTitle, BadgeBar } from 'yti-common-ui/title-block';
import { useGetTerminologyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ConceptBasicInformation from './basic-information/concept-basic-information';
import FormFooter from './form-footer';
import { NewConceptBlock, PageHelpText } from './new-concept.styles';
import ConceptTermsBlock from './concept-terms-block';
import { asString } from '@app/common/utils/hooks/use-url-state';
import { useEffect, useState } from 'react';
import {
  BasicInfo,
  EditConceptType,
  ConceptTermType,
} from './new-concept.types';
import generateFormData from './generate-form-data';
import {
  useGetAuthenticatedUserMutMutation,
  useGetAuthenticatedUserQuery,
} from '@app/common/components/login/login.slice';
import { Notification, Paragraph, Text } from 'suomifi-ui-components';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import validateForm, { FormError } from './validate-form';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { v4 } from 'uuid';
import { StatusChip } from 'yti-common-ui/status-chip';
import { compareLocales } from 'yti-common-ui/utils/compare-locales';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import {
  ConceptInfo,
  LocalizedValue,
} from '@app/common/interfaces/interfaces-v2';
import generateConceptPayload from './generate-concept';
import {
  useCreateConceptMutation,
  useUpdateConceptMutation,
} from '@app/common/components/concept/concept.slice';

interface EditConceptProps {
  terminologyId: string;
  conceptData?: ConceptInfo;
}

export default function EditConcept({
  terminologyId,
  conceptData,
}: EditConceptProps) {
  const { t, i18n } = useTranslation('concept');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const [createConcept, createConceptStatus] = useCreateConceptMutation();
  const [updateConcept, updateConceptStatus] = useUpdateConceptMutation();
  const [isCreating, setIsCreating] = useState(false);

  const { data: terminology } = useGetTerminologyQuery({
    id: terminologyId,
  });
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery();
  const [getAuthenticatedMutUser, authenticatedMutUser] =
    useGetAuthenticatedUserMutMutation();

  const [languages] = useState(
    terminology?.languages?.slice().sort((a, b) => compareLocales(a, b)) ?? []
  );
  const [preferredTerms] = useState<LocalizedValue>(getPreferredTerms());
  const [formData, setFormData] = useState<EditConceptType>(
    generateFormData(preferredTerms, conceptData)
  );
  const [errors, setErrors] = useState<FormError>(validateForm(formData));

  const isEdit = 'conceptId' in router.query;

  const { disableConfirmation, enableConfirmation } =
    useConfirmBeforeLeavingPage(
      Object.keys(preferredTerms).length > 0 && !conceptData
        ? 'enabled'
        : 'disabled'
    );

  const handlePost = () => {
    getAuthenticatedMutUser();

    if (!terminologyId) {
      console.error('Invalid terminologyId');
      return;
    }

    const errors = validateForm(formData);
    setErrors(errors);
    if (errors.total) {
      return;
    }

    setIsCreating(true);
    const concept = generateConceptPayload({
      data: formData,
      isEdit,
    });

    if (isEdit) {
      updateConcept({
        prefix: terminologyId,
        conceptId: formData.basicInformation.identifier,
        concept,
      });
    } else {
      createConcept({ prefix: terminologyId, concept });
    }

    disableConfirmation();
  };

  const updateTerms = (terms: ConceptTermType[]) => {
    setFormData({ ...formData, terms: terms });
    enableConfirmation();
    if (errors.total) {
      const errors = validateForm({ ...formData, terms: terms });
      setErrors(errors);
    }
  };

  const updateBasicInformation = (basicInfo: BasicInfo) => {
    setFormData({ ...formData, basicInformation: basicInfo });
    enableConfirmation();
    if (errors.total) {
      const errors = validateForm({ ...formData, basicInformation: basicInfo });
      setErrors(errors);
    }
  };

  useEffect(() => {
    if (createConceptStatus.isSuccess || updateConceptStatus.isSuccess) {
      router.replace(
        `/terminology/${terminologyId}/concept/${formData.basicInformation.identifier}`
      );
    }
  }, [
    createConceptStatus,
    updateConceptStatus,
    terminologyId,
    router,
    formData.basicInformation.identifier,
  ]);

  useEffect(() => {
    if (formData.terms.some((term) => term.id === '')) {
      setFormData({
        ...formData,
        terms: formData.terms.map((term) => ({
          ...term,
          id: v4(),
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Object.keys(preferredTerms).length < 1) {
    return (
      <>
        <Breadcrumb>
          {router.query.terminologyId && (
            <BreadcrumbLink url={`/terminology/${router.query.terminologyId}`}>
              {getLanguageVersion({
                data: terminology?.label,
                lang: i18n.language,
              })}
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
            {getLanguageVersion({
              data: terminology?.label,
              lang: i18n.language,
            })}
          </BreadcrumbLink>
        )}

        <BreadcrumbLink url="" current>
          {getLanguageVersion({ data: preferredTerms, lang: i18n.language })}
        </BreadcrumbLink>
      </Breadcrumb>

      <NewConceptBlock variant="main" id="main" $isSmall={isSmall}>
        <SubTitle>
          {terminology?.organizations
            .map((org) =>
              getLanguageVersion({ data: org?.label, lang: i18n.language })
            )
            .join(', ')}
        </SubTitle>
        <MainTitle>
          {getLanguageVersion({ data: preferredTerms, lang: i18n.language })}
        </MainTitle>
        <BadgeBar>
          {t('heading')}
          {getLanguageVersion({
            data: terminology?.label,
            lang: i18n.language,
          })}
          <StatusChip status={formData.basicInformation.status}>
            {translateStatus(formData.basicInformation.status, t)}
          </StatusChip>
        </BadgeBar>
        <PageHelpText>{t('new-concept-page-help')}</PageHelpText>

        <ConceptTermsBlock
          languages={languages}
          updateTerms={updateTerms}
          initialValues={formData.terms}
          errors={errors}
        />

        <ConceptBasicInformation
          updateBasicInformation={updateBasicInformation}
          initialValues={formData.basicInformation}
          languages={languages}
          errors={errors}
          terminologyId={terminologyId}
          isEdit={isEdit}
        />

        <FormFooter
          handlePost={handlePost}
          onCancel={disableConfirmation}
          isCreating={isCreating}
          isEdit={typeof conceptData !== 'undefined'}
          errors={errors}
          anonymousUser={
            authenticatedUser?.anonymous || authenticatedMutUser.data?.anonymous
          }
        />
      </NewConceptBlock>
    </>
  );

  function getPreferredTerms(): LocalizedValue {
    return languages.reduce((terms, lang) => {
      terms[lang] = asString(router.query[lang]);
      return terms;
    }, {} as LocalizedValue);
  }
}
