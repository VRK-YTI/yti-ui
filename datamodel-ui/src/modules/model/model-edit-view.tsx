import { usePostModelMutation } from '@app/common/components/model/model.slice';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { ModelType } from '@app/common/interfaces/model.interface';
import { Organization } from '@app/common/interfaces/organizations.interface';
import { ServiceCategory } from '@app/common/interfaces/service-categories.interface';
import {
  getIsPartOfWithId,
  getOrganizationsWithId,
} from '@app/common/utils/get-value';
import getApiError from '@app/common/utils/getApiErrors';
import {
  translateLanguage,
  translateModelFormErrors,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button, Heading } from 'suomifi-ui-components';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import ModelForm from '../model-form';
import generatePayload from './generate-payload';
import { ModelInfoWrapper } from './model.styles';
import { FormUpdateErrors, validateFormUpdate } from './validate-form-update';

interface ModelEditViewProps {
  model: ModelType;
  organizations: Organization[];
  serviceCategories: ServiceCategory[];
  setShow: (value: boolean) => void;
  handleSuccess: () => void;
}

export default function ModelEditView({
  model,
  organizations,
  serviceCategories,
  setShow,
  handleSuccess,
}: ModelEditViewProps) {
  const { t, i18n } = useTranslation('admin');
  const [errors, setErrors] = useState<FormUpdateErrors>();
  const [postModel, result] = usePostModelMutation();
  const [formData, setFormData] = useState<ModelFormType>({
    contact: '',
    languages:
      model.languages.map((lang) => ({
        labelText: translateLanguage(lang, t),
        uniqueItemId: lang,
        title:
          Object.entries(model.label).find((t) => t[0] === lang)?.[1] ?? '',
        description:
          Object.entries(model.description).find((d) => d[0] === lang)?.[1] ??
          '',
        selected: true,
      })) ?? [],
    organizations:
      getOrganizationsWithId(model, organizations, i18n.language) ?? [],
    prefix: model.prefix ?? '',
    serviceCategories:
      getIsPartOfWithId(model, serviceCategories, i18n.language) ?? [],
    status: model.status ?? 'DRAFT',
    type: model.type ?? 'PROFILE',
  });

  useEffect(() => {
    if (result.isSuccess) {
      handleSuccess();
    }
  }, [result, handleSuccess]);

  const handleSubmit = () => {
    if (!formData) {
      return;
    }

    const errors = validateFormUpdate(formData);
    setErrors(errors);

    if (Object.values(errors).includes(true) || errors.titleAmount.length > 0) {
      return;
    }

    const payload = generatePayload(formData);

    postModel({ payload: payload, prefix: formData.prefix });
  };

  return (
    <ModelInfoWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <Heading variant="h2">{t('details')}</Heading>
        <div>
          <Button onClick={() => handleSubmit()}>Tallenna</Button>
          <Button
            variant="secondary"
            style={{ marginLeft: '10px' }}
            onClick={() => setShow(false)}
          >
            Peruuta
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <FormFooterAlert
          labelText={t('missing-information-title', { ns: 'admin' })}
          alerts={getErrors(errors)}
        />
      </div>

      <ModelForm
        formData={formData}
        setFormData={setFormData}
        userPosted={false}
        editMode={true}
      />
    </ModelInfoWrapper>
  );

  function getErrors(errors?: FormUpdateErrors): string[] | undefined {
    if (!errors) {
      return [];
    }

    const langsWithError = Object.entries(errors)
      .filter(([_, value]) => Array.isArray(value))
      ?.flatMap(([key, value]) =>
        (value as string[]).map(
          (lang) =>
            `${translateModelFormErrors(key, t)} ${translateLanguage(lang, t)}`
        )
      );

    const otherErrors = Object.entries(errors)
      .filter(([_, value]) => value && !Array.isArray(value))
      ?.map(([key, _]) => translateModelFormErrors(key, t));

    if (result.isError) {
      const errorMessage = getApiError(result.error);
      return [...langsWithError, ...otherErrors, errorMessage];
    }

    return [...langsWithError, ...otherErrors];
  }
}
