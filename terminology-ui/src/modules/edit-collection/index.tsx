import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import Separator from 'yti-common-ui/separator';
import { BadgeBar, MainTitle, SubTitle } from 'yti-common-ui/title-block';
import { useGetTerminologyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Heading, InlineAlert } from 'suomifi-ui-components';
import ConceptPicker from './concept-picker';
import {
  ButtonBlock,
  DescriptionTextarea,
  FooterBlock,
  CollectionTextInput,
  NewCollectionBlock,
  PageHelpText,
  TextBlockWrapper,
} from './edit-collection.styles';
import {
  CollectionFormData,
  CollectionMember,
  EditCollectionProps,
} from './edit-collection.types';
import {
  useAddCollectionMutation,
  useCollectionExistsMutation,
  useGetCollectionQuery,
  useUpdateCollectionMutation,
} from '@app/common/components/collection/collection.slice';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { TEXT_INPUT_MAX, TEXT_AREA_MAX } from 'yti-common-ui/utils/constants';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SaveSpinner from 'yti-common-ui/save-spinner';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import {
  useGetAuthenticatedUserMutMutation,
  useGetAuthenticatedUserQuery,
} from '@app/common/components/login/login.slice';
import { compareLocales } from 'yti-common-ui/utils/compare-locales';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { ConceptCollectionInfo } from '@app/common/interfaces/interfaces-v2';
import generateCollection from './generate-collection';

type IdentifierError = 'missing' | 'invalid' | 'taken' | null;

export default function EditCollection({
  terminologyId,
  collectionName,
  collectionInfo,
}: EditCollectionProps) {
  const { t, i18n } = useTranslation('collection');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const { data: terminology } = useGetTerminologyQuery({
    id: terminologyId,
  });
  const { data: collection } = useGetCollectionQuery(
    /*
      Setting collectionId as string manually because skip
      flag isn't detected correctly by type checker.
      It informs that collectionId might be undefined even
      though call is skipped if collectionId isn't defined.
    */
    {
      collectionId: collectionInfo?.collectionId as string,
      terminologyId: terminologyId,
    },
    {
      skip: !collectionInfo?.collectionId,
    }
  );
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery();
  const [getAuthenticatedMutUser, authenticatedMutUser] =
    useGetAuthenticatedUserMutMutation();

  const [addCollection, result] = useAddCollectionMutation();
  const [updateCollection, updateResult] = useUpdateCollectionMutation();

  const [emptyError, setEmptyError] = useState(false);
  const [identifierError, setIdentifierError] = useState<IdentifierError>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const languages =
    terminology?.languages?.slice().sort((a, b) => compareLocales(a, b)) ?? [];

  const [formData, setFormData] = useState<CollectionFormData>(
    setInitialData(collection)
  );
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');

  const [checkCollectionExists, exists] = useCollectionExistsMutation();

  function getIdentifierValidationError(value: string): IdentifierError {
    if (!value) {
      return 'missing';
    }
    if (!/^[a-zA-Z]([\w-]){1,98}$/.test(value)) {
      return 'invalid';
    }
    return null;
  }

  function getIdentifierErrorMessage(error = identifierError): string {
    switch (error) {
      case 'missing':
        return t('alert-prefix-undefined', { ns: 'admin' });
      case 'invalid':
        return t('prefix-invalid', { ns: 'admin' });
      case 'taken':
        return t('prefix-taken', { ns: 'admin' });
      default:
        return '';
    }
  }

  useEffect(() => {
    if (result.isSuccess) {
      router.replace(
        `/terminology/${terminologyId}/collection/${formData.identifier}`
      );
    } else if (updateResult.isSuccess) {
      router.replace(
        `/terminology/${terminologyId}/collection/${collectionInfo?.collectionId}`
      );
    }
  }, [
    result,
    updateResult,
    router,
    terminologyId,
    collectionInfo?.collectionId,
    formData.identifier,
  ]);

  useEffect(() => {
    if (exists.data) {
      setIdentifierError('taken');
    } else if (identifierError === 'taken') {
      setIdentifierError(null);
    }
  }, [exists.data, identifierError]);

  const isFormValid = (formData: CollectionFormData) => {
    const currentIdentifierError = getIdentifierValidationError(
      formData.identifier
    );
    const isValidLabel = Object.values(formData.label).some(
      (label) => label.trim() !== ''
    );

    const messages: string[] = [];
    if (!isValidLabel) {
      setEmptyError(true);
      messages.push(t('edit-collection-error.prefLabel'));
    }

    if (currentIdentifierError) {
      setIdentifierError(currentIdentifierError);
      messages.push(getIdentifierErrorMessage(currentIdentifierError));
    } else if (exists.data) {
      setIdentifierError('taken');
      messages.push(getIdentifierErrorMessage('taken'));
    } else {
      setIdentifierError(null);
    }

    setErrorMessages(messages);

    return !currentIdentifierError && !exists.data && isValidLabel;
  };

  const setIdentifier = (value: string) => {
    const data = formData;
    Object.assign(data, { identifier: value });

    setFormData(data);
    enableConfirmation();

    if (identifierError) {
      setIdentifierError(getIdentifierValidationError(value));
    }
  };

  const setName = (language: string, value: string) => {
    const data = formData;
    Object.assign(data, { label: { ...data.label, [language]: value } });

    setFormData(data);
    enableConfirmation();

    if (value && value !== '') {
      setEmptyError(false);
    }
  };

  const setDescription = (language: string, value: string) => {
    const data = formData;
    Object.assign(data, {
      description: { ...data.description, [language]: value },
    });

    setFormData(data);
    enableConfirmation();
  };

  const setFormConcepts = (concepts: CollectionMember[]) => {
    const data = { ...formData };
    data.members = concepts;
    setFormData(data);
    enableConfirmation();
  };

  const handleClick = () => {
    getAuthenticatedMutUser();
    setErrorMessages([]);

    if (!isFormValid(formData)) {
      return;
    }

    const isEdit = !!collectionInfo?.collectionId;
    const payload = generateCollection(formData, isEdit);

    disableConfirmation();
    setIsCreating(true);

    if (isEdit) {
      updateCollection({
        collectionId: collectionInfo.collectionId,
        terminologyId,
        payload,
      });
    } else {
      addCollection({
        terminologyId,
        payload,
      });
    }
  };

  const handleCancel = () => {
    disableConfirmation();
    if (collectionInfo?.collectionId) {
      router.replace(
        `/terminology/${terminologyId}/collection/${collectionInfo?.collectionId}`
      );
    } else {
      router.replace(`/terminology/${terminologyId}`);
    }
  };

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
          {collectionName}
        </BreadcrumbLink>
      </Breadcrumb>

      <NewCollectionBlock $isSmall={isSmall}>
        <SubTitle>
          {terminology?.organizations
            .map((org) =>
              getLanguageVersion({ data: org?.label, lang: i18n.language })
            )
            .join(', ')}
        </SubTitle>
        <MainTitle>{collectionName}</MainTitle>
        <BadgeBar>
          {t('heading')}
          {getLanguageVersion({
            data: terminology?.label,
            lang: i18n.language,
          })}
        </BadgeBar>
        <PageHelpText>{t('new-collection-page-help')}</PageHelpText>

        <Separator isLarge />

        <Heading variant="h3">{t('collection-basic-information')}</Heading>

        <TextBlockWrapper id="collection-text-info-block">
          <CollectionTextInput
            labelText={t('field-identifier')}
            visualPlaceholder={t('enter-collection-identifier')}
            defaultValue={collection?.identifier ?? ''}
            disabled={!!collectionInfo}
            onChange={(e) => setIdentifier(e?.toString() ?? '')}
            status={identifierError ? 'error' : 'default'}
            onBlur={() => {
              const currentIdentifierError = getIdentifierValidationError(
                formData.identifier
              );

              if (currentIdentifierError) {
                setIdentifierError(currentIdentifierError);
                return;
              }

              checkCollectionExists({
                terminologyId,
                collectionId: formData.identifier,
              });
            }}
            statusText={getIdentifierErrorMessage()}
            id="prefix-input"
            maxLength={100}
          />

          {languages.map((language) => (
            <CollectionTextInput
              key={`name-input-${language}`}
              labelText={`${t('field-name')}, ${translateLanguage(
                language,
                t
              )} ${language.toUpperCase()}`}
              visualPlaceholder={t('enter-collection-name')}
              onBlur={(e) => setName(language, e.target.value.trim())}
              status={emptyError ? 'error' : 'default'}
              statusText={
                emptyError ? t('edit-collection-error.prefLabel') : ''
              }
              defaultValue={formData.label[language]}
              maxLength={TEXT_INPUT_MAX}
              className="collection-name-input"
            />
          ))}

          {languages.map((language) => (
            <DescriptionTextarea
              key={`description-textarea-${language}`}
              labelText={`${t('field-definition')}, ${translateLanguage(
                language,
                t
              )} ${language.toUpperCase()}`}
              optionalText={t('optional', { ns: 'admin' })}
              visualPlaceholder={t('enter-collection-description')}
              onBlur={(e) => setDescription(language, e.target.value.trim())}
              defaultValue={formData.description[language]}
              maxLength={TEXT_AREA_MAX}
              className="collection-description-input"
            />
          ))}
        </TextBlockWrapper>

        <Separator isLarge />

        <ConceptPicker
          concepts={formData.members}
          terminologyId={terminologyId}
          onChange={setFormConcepts}
        />

        <Separator isLarge />

        <FooterBlock>
          {(authenticatedUser?.anonymous ||
            authenticatedMutUser.data?.anonymous) && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-occurred_unauthenticated', { ns: 'alert' })}
            </InlineAlert>
          )}
          {errorMessages.length > 0 && (
            <FormFooterAlert
              alerts={errorMessages}
              labelText={t('invalid-information', { ns: 'admin' })}
            />
          )}
          <ButtonBlock>
            <Button
              disabled={
                isCreating ||
                authenticatedUser?.anonymous ||
                authenticatedMutUser.data?.anonymous
              }
              onClick={() => handleClick()}
              id="submit-button"
            >
              {t('save', { ns: 'admin' })}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleCancel()}
              id="cancel-button"
            >
              {t('cancel-variant', { ns: 'admin' })}
            </Button>
            {isCreating && <SaveSpinner text={t('saving-collection')} />}
          </ButtonBlock>
        </FooterBlock>
      </NewCollectionBlock>
    </>
  );

  function setInitialData(collection?: ConceptCollectionInfo) {
    if (collection) {
      return {
        identifier: collection.identifier,
        label: collection.label,
        description: collection.description,
        members: collection.members.map((member) => {
          return {
            uri: member.referenceURI,
            identifier: member.identifier,
            label: member.label,
          };
        }),
      };
    }

    return {
      identifier: '',
      label: {},
      description: {},
      members: [],
    };
  }
}
