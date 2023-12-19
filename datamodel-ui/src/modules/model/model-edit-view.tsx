import {
  setHasChanges,
  useUpdateModelMutation,
  useUpdateVersionedModelMutation,
} from '@app/common/components/model/model.slice';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { ModelType } from '@app/common/interfaces/model.interface';
import {
  getIsPartOfWithId,
  getOrganizationsWithId,
} from '@app/common/utils/get-value';
import getApiError from '@app/common/utils/get-api-errors';
import {
  translateLanguage,
  translateModelFormErrors,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import ModelForm from '../model-form';
import generatePayloadUpdate, {
  generatePayloadVersionedUpdate,
} from './generate-payload';
import { FormUpdateErrors, validateFormUpdate } from './validate-form-update';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import { useStoreDispatch } from '@app/store';
import { v4 } from 'uuid';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { HeaderRow, StyledSpinner } from '@app/common/components/header';

interface ModelEditViewProps {
  model: ModelType;
  hide: () => void;
  handleSuccess: () => void;
}

export default function ModelEditView({
  model,
  hide,
  handleSuccess,
}: ModelEditViewProps) {
  const { t, i18n } = useTranslation('admin');
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const dispatch = useStoreDispatch();
  const [errors, setErrors] = useState<FormUpdateErrors>();
  const [userPosted, setUserPosted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [updateModel, result] = useUpdateModelMutation();
  const [updateVersionedModel, versionedResult] =
    useUpdateVersionedModelMutation();
  const [formData, setFormData] = useState<ModelFormType>({
    contact: model.contact,
    externalNamespaces: model.externalNamespaces ?? [],
    internalNamespaces: model.internalNamespaces ?? [],
    languages: model.languages.map((lang) => ({
      labelText: lang.toUpperCase(),
      uniqueItemId: lang,
      title: Object.entries(model.label).find((t) => t[0] === lang)?.[1] ?? '',
      description:
        Object.entries(model.description).find((d) => d[0] === lang)?.[1] ?? '',
      selected: model.languages.includes(lang),
    })),
    organizations: getOrganizationsWithId(model, i18n.language) ?? [],
    prefix: model.prefix ?? '',
    serviceCategories: getIsPartOfWithId(model, i18n.language) ?? [],
    status: model.status ?? 'DRAFT',
    type: model.type ?? 'PROFILE',
    terminologies: model.terminologies ?? [],
    codeLists: model.codeLists ?? [],
    documentation: model.documentation ?? {},
    links: model.links
      ? model.links.map((l) => ({ ...l, id: v4().split('-')[0] }))
      : [],
  });

  useEffect(() => {
    if (result.isSuccess || versionedResult.isSuccess) {
      handleSuccess();
      dispatch(setNotification('MODEL_EDIT'));
    }
  }, [result, versionedResult, dispatch, handleSuccess]);

  useEffect(() => {
    if (!userPosted) {
      return;
    }

    const errors = validateFormUpdate(formData);
    setErrors(errors);
  }, [userPosted, formData]);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (
      ref.current &&
      ((errors && Object.values(errors).filter((val) => val).length > 0) ||
        result.isError ||
        versionedResult.isError)
    ) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (
      ref.current &&
      headerHeight > ref.current.clientHeight &&
      (errors
        ? Object.values(errors).filter((val) => val).length === 0
        : true) &&
      !result.isError &&
      !versionedResult.isError
    ) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, errors, result, versionedResult, headerHeight]);

  const handleSubmit = () => {
    setUserPosted(true);
    disableConfirmation();
    dispatch(setHasChanges());

    if (!formData) {
      return;
    }

    const errors = validateFormUpdate(formData);
    setErrors(errors);

    if (Object.values(errors).includes(true) || errors.titleAmount.length > 0) {
      return;
    }

    if (!model.version) {
      const payload = generatePayloadUpdate(formData);

      updateModel({
        payload: payload,
        prefix: formData.prefix,
        isApplicationProfile: formData.type === 'PROFILE',
      });
    } else {
      const payload = generatePayloadVersionedUpdate(formData);
      updateVersionedModel({
        payload: payload,
        modelId: formData.prefix,
        version: model.version,
      });
    }
  };

  const handleUpdate = (data: ModelFormType) => {
    enableConfirmation();
    dispatch(setHasChanges(true));
    setFormData(data);
  };

  return (
    <>
      <StaticHeader ref={ref}>
        <HeaderRow>
          <Text variant="bold">{t('edit-data-model')}</Text>
          <HeaderRow>
            <Button onClick={() => handleSubmit()}>
              {result.isLoading || versionedResult.isLoading ? (
                <div role="alert">
                  <StyledSpinner
                    variant="small"
                    text={t('saving')}
                    textAlign="right"
                  />
                </div>
              ) : (
                <>{t('save')}</>
              )}
            </Button>
            <Button
              variant="secondary"
              style={{ marginLeft: '10px' }}
              onClick={() => hide()}
            >
              {t('cancel-variant')}
            </Button>
          </HeaderRow>
        </HeaderRow>

        <div>
          <FormFooterAlert
            labelText={t('missing-information-title', { ns: 'admin' })}
            alerts={getErrors(errors)}
          />
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        <ModelForm
          formData={formData}
          setFormData={handleUpdate}
          userPosted={userPosted}
          editMode={true}
          errors={userPosted ? errors : undefined}
          oldVersion={!!model.version}
        />
      </DrawerContent>
    </>
  );

  function getErrors(errors?: FormUpdateErrors): string[] | undefined {
    if (!errors) {
      return [];
    }

    const langsWithError =
      errors.titleAmount.length > 0
        ? [
            `${translateModelFormErrors('titleAmount', t)} ${errors.titleAmount
              .map((lang) => translateLanguage(lang, t))
              .join(', ')}`,
          ]
        : [];

    const otherErrors = Object.entries(errors)
      .filter(([_, value]) => value && !Array.isArray(value))
      ?.map(([key, _]) => translateModelFormErrors(key, t));

    if (result.isError) {
      const errorMessage = getApiError(result.error);
      return [...langsWithError, ...otherErrors, ...errorMessage];
    }

    if (versionedResult.isError) {
      const errorMessage = getApiError(versionedResult.error);
      return [...langsWithError, ...otherErrors, ...errorMessage];
    }

    return [...langsWithError, ...otherErrors];
  }
}
