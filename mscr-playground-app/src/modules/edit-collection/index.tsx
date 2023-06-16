import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import { useAddCollectionMutation } from '@app/common/components/modify/modify.slice';
import PropertyValue from '@app/common/components/property-value';
import Separator from 'yti-common-ui/separator';
import { BadgeBar, MainTitle, SubTitle } from 'yti-common-ui/title-block';
import { getProperty } from '@app/common/utils/get-property';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Heading, InlineAlert } from 'suomifi-ui-components';
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
import {
  EditCollectionFormDataType,
  EditCollectionProps,
} from './edit-collection.types';
import { useGetCollectionQuery } from '@app/common/components/collection/collection.slice';
import { Collection } from '@app/common/interfaces/collection.interface';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { TEXT_INPUT_MAX, TEXT_AREA_MAX } from 'yti-common-ui/utils/constants';
import useConfirmBeforeLeavingPage from '@app/common/utils/hooks/use-confirm-before-leaving-page';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SaveSpinner from 'yti-common-ui/save-spinner';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import {
  useGetAuthenticatedUserMutMutation,
  useGetAuthenticatedUserQuery,
} from '@app/common/components/login/login.slice';
import Collection from '../collection';
import Collection from '../collection';
import Collection from '../collection';

export default function EditCollection({
  terminologyId,
  collectionName,
  collectionInfo,
}: EditCollectionProps) {
  const { t } = useTranslation('collection');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery();
  const [getAuthenticatedMutUser, authenticatedMutUser] =
    useGetAuthenticatedUserMutMutation();

  const [addCollection, result] = useAddCollectionMutation();
  const [newCollectionId, setNewCollectionId] = useState('');
  const [emptyError, setEmptyError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<EditCollectionFormDataType>(
    setInitialData()
  );
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');

  useEffect(() => {
    if (result.isSuccess) {
      router.replace(
        `/terminology/${terminologyId}/collection/${newCollectionId}`
      );
    }
  }, [result, router, terminologyId, newCollectionId]);

  const setName = (language: string, value: string) => {
    const data = formData;
    if (data.name.some((n) => n.lang === language)) {
      data.name = data.name.map((n) => {
        if (n.lang === language) {
          return {
            lang: n.lang,
            value: value,
          };
        }
        return n;
      });
    } else {
      data.name.push({
        lang: language,
        value: value,
      });
    }
    setFormData(data);
    enableConfirmation();

    if (value && value !== '') {
      setEmptyError(false);
    }
  };

  const setDescription = (language: string, value: string) => {
    const data = formData;

    if (data.definition.some((d) => d.lang === language)) {
      data.definition = data.definition.map((d) => {
        if (d.lang === language) {
          return {
            lang: d.lang,
            value: value,
          };
        }
        return d;
      });
    } else {
      data.definition.push({
        lang: language,
        value: value,
      });
    }

    setFormData(data);
    enableConfirmation();
  };

  const setFormConcepts = (
    concepts: EditCollectionFormDataType['concepts']
  ) => {
    const data = { ...formData };
    data.concepts = concepts;
    setFormData(data);
    enableConfirmation();
  };

  const handleClick = () => {
    getAuthenticatedMutUser();

    if (formData.name.every((n) => !n.value)) {
      setEmptyError(true);
      return;
    }

    disableConfirmation();
    setIsCreating(true);
    const data = generateCollection(
      formData,
      terminologyId,
      `${authenticatedUser?.firstName} ${authenticatedUser?.lastName}`,
      collectionInfo
    );
    setNewCollectionId(collectionInfo?.collectionId ?? data[0].id);
    addCollection(data);
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
      <NewCollectionBlock $isSmall={isSmall}>
        <SubTitle>
          <PropertyValue property={getProperty('prefLabel')} />
        </SubTitle>
        <MainTitle>{collectionName}</MainTitle>
        <PageHelpText>{t('new-collection-page-help')}</PageHelpText>

        <Separator isLarge />

        <Heading variant="h3">{t('collection-basic-information')}</Heading>

        <Separator isLarge />

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

  function setInitialData(collection?: Collection) {
    if (collection) {
      return {
        name: collection.properties.prefLabel
          ? collection.properties.prefLabel.map((l) => ({
              lang: l.lang,
              value: l.value.trim(),
            }))
          : [],
        definition: collection.properties.definition
          ? collection.properties.definition.map((d) => ({
              lang: d.lang,
              value: d.value.trim(),
            }))
          : [],
        concepts: collection.references.member
          ? collection.references.member.map((m) => {
              const prefLabels = new Map();

              m.references.prefLabelXl?.map((label) => {
                prefLabels.set(
                  label.properties.prefLabel?.[0].lang,
                  label.properties.prefLabel?.[0].value
                );
              });

              return {
                id: m.id,
                prefLabels: Object.fromEntries(prefLabels),
              };
            })
          : [],
      };
    }
  }
}
