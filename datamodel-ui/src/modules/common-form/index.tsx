import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  Text,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import ConceptBlock from '../concept-block';
import { LanguageVersionedWrapper } from '../class-form/class-form.styles';
import { statusList } from 'yti-common-ui/utils/status-list';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { FormWrapper } from './common-form.styles';
import InlineListBlock from '@app/common/components/inline-list-block';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import {
  translateCommonForm,
  translateCommonFormErrors,
} from '@app/common/utils/translation-helpers';
import {
  AssociationFormType,
  initialAssociation,
} from '@app/common/interfaces/association-form.interface';
import {
  AttributeFormType,
  initialAttribute,
} from '@app/common/interfaces/attribute-form.interface';
import { Status } from '@app/common/interfaces/status.interface';
import validateForm from './validate-form';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import { usePutResourceMutation } from '@app/common/components/resource/resource.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import {
  AxiosBaseQueryError,
  AxiosQueryErrorFields,
} from 'yti-common-ui/interfaces/axios-base-query.interface';

interface AttributeFormProps {
  handleReturn: () => void;
  type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE;
  modelId: string;
  initialSubResourceOf?: { label: string; uri: string };
  languages: string[];
  terminologies: string[];
}

export default function CommonForm({
  handleReturn,
  type,
  modelId,
  initialSubResourceOf,
  languages,
  terminologies,
}: AttributeFormProps) {
  const { t } = useTranslation('admin');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(getInitialData());
  const [userPosted, setUserPosted] = useState(false);
  const [errors, setErrors] = useState(validateForm(data));
  const [putResource, result] = usePutResourceMutation();
  const statuses = statusList;

  const handleSubmit = () => {
    if (!userPosted) {
      setUserPosted(true);
    }

    const errors = validateForm(data);
    setErrors(errors);

    if (Object.values(errors).filter((val) => val).length > 0) {
      return;
    }

    // TODO: Remove subResourceOf clearing when other supported
    // are implemented
    putResource({
      modelId: modelId,
      data: { ...data, type: type, subResourceOf: [] },
    });
  };

  const handleUpdate = (value: typeof data) => {
    if (userPosted && Object.values(errors).filter((val) => val).length > 0) {
      setErrors(validateForm(value));
    }

    setData(value);
  };

  const handleSetConcept = (
    value?: AttributeFormType['concept'] | AssociationFormType['concept']
  ) => {
    const label =
      value && 'label' in value
        ? Object.fromEntries(
            Object.entries(data.label)
              .map((obj) => {
                if (value.label[obj[0]] != null) {
                  return [[obj[0]], value.label[obj[0]]];
                }
                return [[obj[0]], data.label[obj[0]]];
              })
              .filter(
                (obj) =>
                  data.label[Array.isArray(obj[0]) ? obj[0][0] : obj[0]] === ''
              )
          )
        : undefined;

    handleUpdate({
      ...data,
      concept: value ? value : {},
      label: label ? { ...data.label, ...label } : data.label,
    });
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (
      ref.current &&
      userPosted &&
      (Object.values(errors).filter((val) => val).length > 0 || result.error)
    ) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, errors, userPosted, result.error]);

  useEffect(() => {
    if (result.isError && result.error && 'data' in result.error) {
      const backendErrorFields =
        (result.error as AxiosQueryErrorFields).data?.details?.map(
          (d) => d.field
        ) ?? [];

      if (backendErrorFields.length > 0) {
        setErrors({
          identifier: backendErrorFields.includes('identifier'),
          label: backendErrorFields.includes('label'),
        });
        return;
      }

      if (result.error?.status === 401) {
        setErrors({
          ...validateForm(data),
          unauthorized: true,
        });
      }
    }
  }, [result.isError, result.error, data]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Button
            variant="secondaryNoBorder"
            icon="arrowLeft"
            style={{ textTransform: 'uppercase' }}
            onClick={() => handleReturn()}
          >
            {t('back', { ns: 'common' })}
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text variant="bold">
            {Object.entries(data.label).find((l) => l[1] !== '')?.[1] ??
              translateCommonForm('name', type, t)}
          </Text>

          <div>
            <Button
              onClick={() => handleSubmit()}
              style={{ marginRight: '15px' }}
            >
              {t('save')}
            </Button>
            <Button variant="secondary" onClick={() => handleReturn()}>
              {t('cancel-variant')}
            </Button>
          </div>
        </div>

        {userPosted &&
        (Object.values(errors).filter((val) => val).length > 0 ||
          result.isError) ? (
          <div>
            <FormFooterAlert
              labelText={
                Object.keys(errors).filter(
                  (key) =>
                    ['label', 'identifier'].includes(key) &&
                    errors[key as keyof typeof errors] === true
                ).length > 0
                  ? t('missing-information-title')
                  : t('unexpected-error-title')
              }
              alerts={getErrors()}
            />
          </div>
        ) : (
          <></>
        )}
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        <FormWrapper>
          <ConceptBlock
            concept={data.concept}
            setConcept={handleSetConcept}
            terminologies={terminologies}
          />

          <LanguageVersionedWrapper>
            {languages.map((lang) => (
              <TextInput
                key={`label-${lang}`}
                className="wide-text"
                labelText={`${translateCommonForm('name', type, t)}, ${lang}`}
                value={data.label[lang] ?? ''}
                onChange={(e) =>
                  handleUpdate({
                    ...data,
                    label: { ...data.label, [lang]: e?.toString() ?? '' },
                  })
                }
                status={userPosted && errors.label ? 'error' : 'default'}
              />
            ))}
          </LanguageVersionedWrapper>

          <TextInput
            labelText={translateCommonForm('identifier', type, t)}
            defaultValue={data.identifier}
            onChange={(e) =>
              handleUpdate({
                ...data,
                identifier: e?.toString() ?? '',
              })
            }
            status={userPosted && errors.identifier ? 'error' : 'default'}
          />

          <InlineListBlock
            label={translateCommonForm('upper', type, t)}
            items={data.subResourceOf.map((resource) => ({
              id: resource,
              label: resource,
            }))}
            addNewComponent={
              <Button variant="secondary" icon="plus">
                {translateCommonForm('add-upper', type, t)}
              </Button>
            }
            handleRemoval={() => null}
          />

          <InlineListBlock
            label={translateCommonForm('equivalent', type, t)}
            items={[]}
            addNewComponent={
              <Button variant="secondary">
                {translateCommonForm('add-equivalent', type, t)}
              </Button>
            }
            handleRemoval={() => null}
          />

          <div>
            <Dropdown
              labelText={t('status')}
              defaultValue="DRAFT"
              onChange={(e) => handleUpdate({ ...data, status: e as Status })}
            >
              {statuses.map((status) => (
                <DropdownItem key={`status-${status}`} value={status}>
                  {translateStatus(status, t)}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          <LanguageVersionedWrapper>
            {languages.map((lang) => (
              <Textarea
                key={`label-${lang}`}
                labelText={`${translateCommonForm('note', type, t)}, ${lang}`}
                defaultValue={data.note[lang] ?? ''}
                onChange={(e) =>
                  handleUpdate({
                    ...data,
                    note: { ...data.note, [lang]: e.target.value ?? '' },
                  })
                }
                optionalText={t('optional')}
                className="wide-text"
              />
            ))}
          </LanguageVersionedWrapper>

          <Textarea
            labelText={translateCommonForm('editorial-note', type, t)}
            optionalText={t('optional')}
            defaultValue={data.editorialNote}
            onChange={(e) =>
              handleUpdate({ ...data, editorialNote: e.target.value ?? '' })
            }
            hintText={t('editor-comment-hint')}
            className="wide-text"
          />
        </FormWrapper>
      </DrawerContent>
    </>
  );

  function getInitialData(): AssociationFormType | AttributeFormType {
    const label = Object.fromEntries(languages.map((lang) => [lang, '']));

    if (!initialSubResourceOf) {
      return type === ResourceType.ASSOCIATION
        ? {
            ...initialAssociation,
            label: label,
            subResourceOf: ['owl:TopObjectProperty'],
          }
        : {
            ...initialAttribute,
            label: label,
            subResourceOf: ['owl:topDataProperty'],
          };
    }

    return type === ResourceType.ASSOCIATION
      ? {
          ...initialAssociation,
          label: label,
          subResourceOf: [initialSubResourceOf.label],
        }
      : {
          ...initialAttribute,
          label: label,
          subResourceOf: [initialSubResourceOf.label],
        };
  }

  function getErrors(): string[] {
    const translatedErrors = Object.entries(errors)
      .filter((e) => e[1])
      .map((e) => translateCommonFormErrors(e[0], type, t));

    if (result.error) {
      const error = result.error as AxiosBaseQueryError;
      const errorStatus = error.status ?? '';
      const errorTitle =
        error.data &&
        Object.entries(error.data).filter(
          (entry) => entry[0] === 'title'
        )?.[0]?.[1];
      const errorDetail =
        error.data &&
        Object.entries(error.data).filter(
          (entry) => entry[0] === 'detail'
        )?.[0]?.[1];
      const catchedError = `Error ${errorStatus}: ${
        errorTitle ?? t('unexpected-error-title')
      } ${errorDetail}`;

      return [...translatedErrors, catchedError];
    }

    return translatedErrors;
  }
}
