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
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconArrowLeft, IconPlus } from 'suomifi-icons';
import {
  Button,
  Dropdown,
  DropdownItem,
  Text,
  TextInput,
  Textarea,
} from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { Status } from 'yti-common-ui/interfaces/status.interface';
import { FormWrapper, LanguageVersionedWrapper } from './resource-form.styles';
import validateForm from './validate-form';
import { ConceptType } from '@app/common/interfaces/concept-interface';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { statusList } from 'yti-common-ui/utils/status-list';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import {
  selectHasChanges,
  setHasChanges,
  setSelected,
  setView,
} from '@app/common/components/model/model.slice';
import { useRouter } from 'next/router';
import getApiError from '@app/common/utils/get-api-errors';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import RangeAndDomain from './components/range-and-domain';
import AttributeRestrictions from './components/attribute-restrictions';
import ApplicationProfileTop from './components/application-profile-top';
import AssociationRestrictions from './components/association-restrictions';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';

interface ResourceFormProps {
  type: ResourceType;
  modelId: string;
  languages: string[];
  terminologies: string[];
  isEdit: boolean;
  applicationProfile?: boolean;
  refetch: () => void;
  handleReturn: () => void;
}

export default function ResourceForm({
  type,
  modelId,
  languages,
  terminologies,
  isEdit,
  applicationProfile,
  refetch,
  handleReturn,
}: ResourceFormProps) {
  const { t } = useTranslation('admin');
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const statuses = statusList;
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const data = useSelector(selectResource());
  const hasChanges = useSelector(selectHasChanges());
  const [userPosted, setUserPosted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [errors, setErrors] = useState(validateForm(data));
  const [putResource, result] = usePutResourceMutation();

  const { data: identifierFree, isSuccess } = useGetResourceIdentifierFreeQuery(
    {
      prefix: modelId,
      identifier: data.identifier,
    },
    {
      skip: isEdit || data.identifier === '',
    }
  );

  const handleSubmit = () => {
    disableConfirmation();
    dispatch(setHasChanges(false));
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

  const handleUpdate = (value: ResourceFormType) => {
    enableConfirmation();
    dispatch(setHasChanges(true));
    if (userPosted && Object.values(errors).filter((val) => val).length > 0) {
      setErrors(validateForm(value));
    }

    dispatch(setResource(value));
  };

  const handleUpdateByKey = <T extends keyof ResourceFormType>(
    key: T,
    value: ResourceFormType[T]
  ) => {
    handleUpdate({ ...data, [key]: value });
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

      if (isEdit) {
        refetch();
      }

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
  }, [
    ref,
    errors,
    userPosted,
    result,
    dispatch,
    type,
    router,
    modelId,
    data,
    refetch,
    isEdit,
  ]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Button
            icon={<IconArrowLeft />}
            variant="secondaryNoBorder"
            onClick={() => {
              if (!hasChanges) {
                handleReturn();
              }
            }}
            style={{ textTransform: 'uppercase' }}
            id="back-button"
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
              id="submit-button"
            >
              {t('save')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                handleReturn();
                dispatch(setHasChanges(false));
              }}
              id="cancel-button"
            >
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
          <ApplicationProfileTop
            defaultChecked={true}
            type={type}
            applicationProfile={applicationProfile}
          />

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
                id="label-input"
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
            id="prefix-input"
          />

          <RangeAndDomain
            applicationProfile={applicationProfile}
            modelId={modelId}
            type={type}
            data={data}
            handleUpdate={handleUpdate}
          />

          {!applicationProfile && (
            <>
              <InlineListBlock
                label={translateCommonForm('upper', type, t)}
                items={
                  data.subResourceOf?.map((resource) => ({
                    id: resource,
                    label: resource,
                  })) ?? []
                }
                addNewComponent={
                  <Button
                    variant="secondary"
                    icon={<IconPlus />}
                    id="add-upper-button"
                  >
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
                  <Button
                    variant="secondary"
                    icon={<IconPlus />}
                    id="add-equivalent-button"
                  >
                    {translateCommonForm('add-equivalent', type, t)}
                  </Button>
                }
                optionalText={t('optional')}
                handleRemoval={() => null}
              />
            </>
          )}

          <AssociationRestrictions
            data={data}
            type={type}
            applicationProfile={applicationProfile}
            handleUpdate={handleUpdateByKey}
          />

          <div>
            <Dropdown
              labelText={t('status')}
              defaultValue={data.status ?? 'DRAFT'}
              onChange={(e) => handleUpdate({ ...data, status: e as Status })}
              id="status-dropdown"
            >
              {statuses.map((status) => (
                <DropdownItem key={`status-${status}`} value={status}>
                  {translateStatus(status, t)}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          <AttributeRestrictions
            data={data}
            type={type}
            applicationProfile={applicationProfile}
            handleUpdate={handleUpdateByKey}
          />

          <LanguageVersionedWrapper>
            {languages.map((lang) => (
              <Textarea
                key={`label-${lang}`}
                labelText={`${translateCommonForm('note', type, t)}, ${lang}`}
                defaultValue={data.note?.[lang] ?? ''}
                onChange={(e) =>
                  handleUpdate({
                    ...data,
                    note: { ...data.note, [lang]: e.target.value ?? '' },
                  })
                }
                optionalText={t('optional')}
                className="wide-text"
                id="note-input"
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
            id="editorial-note-input"
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
