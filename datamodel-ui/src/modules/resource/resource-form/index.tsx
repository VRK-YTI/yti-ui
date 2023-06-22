import InlineListBlock from '@app/common/components/inline-list-block';
import {
  selectResource,
  setResource,
  useGetResourceIdentifierFreeQuery,
  usePutResourceMutation,
} from '@app/common/components/resource/resource.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import {
  translateCommonForm,
  translateCommonFormErrors,
} from '@app/common/utils/translation-helpers';
import ConceptBlock from '@app/modules/concept-block';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconArrowLeft, IconPlus } from 'suomifi-icons';
import {
  Button,
  Dropdown,
  DropdownItem,
  SingleSelect,
  SingleSelectData,
  Text,
  TextInput,
  Textarea,
} from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { Status } from 'yti-common-ui/interfaces/status.interface';
import { FormWrapper, LanguageVersionedWrapper } from './resource-form.styles';
import validateForm from './validate-form';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { ConceptType } from '@app/common/interfaces/concept-interface';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { statusList } from 'yti-common-ui/utils/status-list';
import ClassModal from '@app/modules/class-modal';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import { setSelected, setView } from '@app/common/components/model/model.slice';
import { useRouter } from 'next/router';
import getApiError from '@app/common/utils/get-api-errors';
import { useGetDatatypesQuery } from '@app/common/components/datatypes/datatypes.slice';

interface ResourceFormProps {
  type: ResourceType;
  modelId: string;
  languages: string[];
  terminologies: string[];
  isEdit: boolean;
  applicationProfile?: boolean;
  handleReturn: () => void;
}

export default function ResourceForm({
  type,
  modelId,
  languages,
  terminologies,
  isEdit,
  applicationProfile,
  handleReturn,
}: ResourceFormProps) {
  const { t, i18n } = useTranslation('admin');
  const statuses = statusList;
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const data = useSelector(selectResource());
  const [userPosted, setUserPosted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [errors, setErrors] = useState(validateForm(data));
  const [putResource, result] = usePutResourceMutation();
  const { data: dataTypesResult, isSuccess: isDataTypesSuccess } =
    useGetDatatypesQuery();

  const { data: identifierFree, isSuccess } = useGetResourceIdentifierFreeQuery(
    {
      prefix: modelId,
      identifier: data.identifier,
    },
    {
      skip: isEdit || data.identifier === '',
    }
  );

  const attributeRanges: SingleSelectData[] = useMemo(() => {
    if (!isDataTypesSuccess) {
      return [];
    }

    return dataTypesResult.map((result) => ({
      labelText: result,
      uniqueItemId: result,
    }));
  }, [dataTypesResult, isDataTypesSuccess]);

  const handleSubmit = () => {
    if (!userPosted) {
      setUserPosted(true);
    }

    const errors = validateForm(data);
    setErrors(errors);

    if (
      Object.values(errors).filter((val) => val).length > 0 ||
      (isSuccess && !identifierFree)
    ) {
      return;
    }

    const usedLabels = Object.fromEntries(
      Object.entries(data.label).filter((obj) => obj[1] !== '')
    );

    // TODO: Remove subResourceOf clearing when other supported
    // are implemented

    putResource({
      modelId: modelId,
      data: { ...data, type: type, subResourceOf: [], label: usedLabels },
      resourceId: isEdit ? data.identifier : undefined,
      applicationProfile,
    });
  };

  const handleUpdate = (value: typeof data) => {
    if (userPosted && Object.values(errors).filter((val) => val).length > 0) {
      setErrors(validateForm(value));
    }

    dispatch(setResource(value));
  };

  const handleSetConcept = (value?: ConceptType) => {
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
      concept: value ? value : undefined,
      label: label ? { ...data.label, ...label } : data.label,
    });
  };

  const handleDomainFollowUp = (value?: InternalClass) => {
    if (!value) {
      handleUpdate({ ...data, domain: value });
      return;
    }

    handleUpdate({
      ...data,
      domain: {
        id: value.id,
        label: getLanguageVersion({
          data: value.label,
          lang: i18n.language,
          appendLocale: true,
        }),
      },
    });
  };

  const handleRangeFollowUp = (value?: InternalClass) => {
    if (type === ResourceType.ATTRIBUTE) {
      return;
    }

    if (!value) {
      handleUpdate({ ...data, range: value });
      return;
    }

    handleUpdate({
      ...data,
      range: {
        id: value.id,
        label: getLanguageVersion({
          data: value.label,
          lang: i18n.language,
          appendLocale: true,
        }),
      },
    });
  };

  const handleDomainOrRangeRemoval = (id: string, type: 'domain' | 'range') => {
    handleUpdate({
      ...data,
      [type]: undefined,
    });
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (result.isSuccess) {
      dispatch(
        setSelected(
          data.identifier,
          type === ResourceType.ASSOCIATION ? 'associations' : 'attributes'
        )
      );
      dispatch(
        setView(
          type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
          'info'
        )
      );
      router.replace(
        `${modelId}/${
          type === ResourceType.ASSOCIATION ? 'association' : 'attribute'
        }/${data.identifier}`
      );
    }

    if (
      ref.current &&
      userPosted &&
      (Object.values(errors).filter((val) => val).length > 0 || result.error)
    ) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, errors, userPosted, result, dispatch, type, router, modelId, data]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Button
            icon={<IconArrowLeft />}
            variant="secondaryNoBorder"
            onClick={() => handleReturn()}
            style={{ textTransform: 'uppercase' }}
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
          result.isError ||
          (isSuccess && !identifierFree)) ? (
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
            status={
              (userPosted &&
                (errors.identifier ||
                  errors.identifierInitChar ||
                  errors.identifierLength)) ||
              (isSuccess && !identifierFree)
                ? 'error'
                : 'default'
            }
            disabled={isEdit}
            debounce={300}
            statusText={
              isSuccess && !identifierFree ? t('error-prefix-taken') : ''
            }
          />

          {type === ResourceType.ATTRIBUTE && (
            <>
              <SingleSelect
                labelText={t('range')}
                itemAdditionHelpText=""
                ariaOptionsAvailableText={t('available-ranges') as string}
                defaultSelectedItem={attributeRanges.find(
                  (value) => value.uniqueItemId == '-1'
                )}
                selectedItem={attributeRanges.find((value) => {
                  if (data.range != undefined) {
                    return value.uniqueItemId == data.range.id;
                  } else {
                    return value.uniqueItemId == 'rdfs:Literal';
                  }
                })}
                clearButtonLabel={t('clear-selection')}
                onItemSelect={(e) =>
                  e != undefined &&
                  handleUpdate({ ...data, range: { id: e, label: e } })
                }
                items={attributeRanges}
              />

              <InlineListBlock
                addNewComponent={
                  <ClassModal
                    handleFollowUp={handleDomainFollowUp}
                    modelId={modelId}
                    modalButtonLabel={t('select-class')}
                    mode="select"
                    initialSelected={data.domain?.id}
                  />
                }
                handleRemoval={(id: string) =>
                  handleDomainOrRangeRemoval(id, 'domain')
                }
                items={data.domain ? [data.domain] : []}
                label={`${t('class')} (rdfs:domain)`}
                optionalText={t('optional')}
              />
            </>
          )}

          {type === ResourceType.ASSOCIATION && (
            <>
              <InlineListBlock
                addNewComponent={
                  <ClassModal
                    handleFollowUp={handleDomainFollowUp}
                    modelId={modelId}
                    modalButtonLabel={t('select-class')}
                    mode="select"
                    initialSelected={data.domain?.id}
                  />
                }
                handleRemoval={(id: string) =>
                  handleDomainOrRangeRemoval(id, 'domain')
                }
                items={data.domain ? [data.domain] : []}
                label={t('source-class')}
                optionalText={t('optional')}
              />

              <InlineListBlock
                addNewComponent={
                  <ClassModal
                    handleFollowUp={handleRangeFollowUp}
                    modelId={modelId}
                    modalButtonLabel={t('select-class')}
                    mode="select"
                    initialSelected={data.range?.id}
                  />
                }
                handleRemoval={(id: string) =>
                  handleDomainOrRangeRemoval(id, 'range')
                }
                items={
                  data.range && typeof data.range !== 'string'
                    ? [data.range]
                    : []
                }
                label={t('target-class')}
                optionalText={t('optional')}
              />
            </>
          )}

          <InlineListBlock
            label={translateCommonForm('upper', type, t)}
            items={data.subResourceOf.map((resource) => ({
              id: resource,
              label: resource,
            }))}
            addNewComponent={
              <Button variant="secondary" icon={<IconPlus />}>
                {translateCommonForm('add-upper', type, t)}
              </Button>
            }
            deleteDisabled={[
              'owl:topDataProperty',
              'owl:TopObjectProperty',
              'owl:topObjectProperty',
            ]}
            handleRemoval={() => null}
          />

          <InlineListBlock
            label={translateCommonForm('equivalent', type, t)}
            items={[]}
            addNewComponent={
              <Button variant="secondary" icon={<IconPlus />}>
                {translateCommonForm('add-equivalent', type, t)}
              </Button>
            }
            optionalText={t('optional')}
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
            labelText={translateCommonForm('work-group-comment', type, t)}
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

  function getErrors(): string[] {
    const translatedErrors = Object.entries(errors)
      .filter((e) => e[1])
      .map((e) =>
        translateCommonFormErrors(
          e[0],
          type === ResourceType.ASSOCIATION
            ? ResourceType.ASSOCIATION
            : ResourceType.ATTRIBUTE,
          t
        )
      );

    if (isSuccess && !identifierFree) {
      return [...translatedErrors, t('error-prefix-taken')];
    }

    if (result.error) {
      const catchedError = getApiError(result.error);
      return [...translatedErrors, ...catchedError];
    }

    return translatedErrors;
  }
}
