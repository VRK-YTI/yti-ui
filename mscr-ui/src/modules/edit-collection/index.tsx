import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
//import { useAddCollectionMutation } from '@app/common/components/modify/modify.slice';
//import PropertyValue from '@app/common/components/property-value';
import Separator from 'yti-common-ui/separator';
import { BadgeBar, MainTitle, SubTitle } from 'yti-common-ui/title-block';
//import { getProperty } from '@app/common/utils/get-property';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Heading, InlineAlert } from 'suomifi-ui-components';
import ConceptPicker from './concept-picker';
import generateCollection from './generate-collection';
import {
  ButtonBlock,
  DescriptionTextarea,
  FooterBlock,
  NameTextInput,
  NewCollectionBlock,
  PageHelpText,
  TextBlockWrapper,
} from './edit-collection.styles';
//import { useGetCollectionQuery } from '@app/common/components/collection/collection.slice';
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
import { Schema } from '@app/common/interfaces/schema.interface';
import { Collection } from '@app/common/interfaces/collection.interface';
import { Crosswalk } from '@app/common/interfaces/crosswalk.interface';

interface EditCollectionProps {
  schema: Schema;
}

export default function EditCollection({ schema }: EditCollectionProps) {
  const { t } = useTranslation('collection');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery();
  const [getAuthenticatedMutUser, authenticatedMutUser] =
    useGetAuthenticatedUserMutMutation();
  const [emptyError, setEmptyError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');

  const setDescription = (language: string, value: string) => {
    const data = schema.description;

    //setFormData(data);
    enableConfirmation();
  };

  const handleClick = () => {
    getAuthenticatedMutUser();
  };

  const handleCancel = () => {
    disableConfirmation();
  };

  return (
    <>
      <NewCollectionBlock $isSmall={isSmall}>
        <SubTitle>{schema.pid}</SubTitle>
        <MainTitle>{schema.format}</MainTitle>

        <PageHelpText>{t('new-collection-page-help')}</PageHelpText>

        <Separator isLarge />

        <Heading variant="h3">{t('collection-basic-information')}</Heading>

        <TextBlockWrapper id="collection-text-info-block">
          {schema.languages.map((language) => (
            <NameTextInput
              key={`name-input-${language}`}
              labelText={`${t('field-name')}, ${translateLanguage(
                language,
                t
              )} ${language.toUpperCase()}`}
              visualPlaceholder={t('enter-collection-name')}
              maxLength={TEXT_INPUT_MAX}
              className="collection-name-input"
            />
          ))}

          {schema.languages.map((language) => (
            <DescriptionTextarea
              key={`description-textarea-${language}`}
              labelText={`${t('field-definition')}, ${translateLanguage(
                language,
                t
              )} ${language.toUpperCase()}`}
              optionalText={t('optional', { ns: 'admin' })}
              visualPlaceholder={t('enter-collection-description')}
              onBlur={(e) => setDescription(language, e.target.value.trim())}
              maxLength={TEXT_AREA_MAX}
              className="collection-description-input"
            />
          ))}
        </TextBlockWrapper>

        <Separator isLarge />

        <FooterBlock>
          {(authenticatedUser?.anonymous ||
            authenticatedMutUser.data?.anonymous) && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-occurred_unauthenticated', { ns: 'alert' })}
            </InlineAlert>
          )}
          {emptyError && (
            <FormFooterAlert
              alerts={[t('edit-collection-error.prefLabel')]}
              labelText={t('missing-information', { ns: 'admin' })}
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
}
