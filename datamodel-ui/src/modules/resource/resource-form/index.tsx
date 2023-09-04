import InlineListBlock from '@app/common/components/inline-list-block';
import {
  selectResource,
  setResource,
  useGetResourceExistsQuery,
  useUpdateResourceMutation,
  useCreateResourceMutation,
  useTogglePropertyShapeMutation,
  useGetResourceActiveQuery,
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
import { IconArrowLeft } from 'suomifi-icons';
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
} from '@app/common/components/model/model.slice';
import { useRouter } from 'next/router';
import getApiError from '@app/common/utils/get-api-errors';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import RangeAndDomain from './components/range-and-domain';
import AttributeRestrictions from './components/attribute-restrictions';
import ApplicationProfileTop from './components/application-profile-top';
import AssociationRestrictions from './components/association-restrictions';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import ResourceModal from '../resource-modal';
import useSetView from '@app/common/utils/hooks/use-set-view';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';

interface ResourceFormProps {
  modelId: string;
  languages: string[];
  terminologies: string[];
  isEdit?: boolean;
  currentModelId: string;
  applicationProfile?: boolean;
  refetch?: () => void;
  handleReturn: () => void;
  handleFollowUp?: (identifier: string, type: ResourceType) => void;
}

export default function ResourceForm({
  modelId,
  languages,
  terminologies,
  isEdit,
  currentModelId,
  applicationProfile,
  refetch,
  handleReturn,
  handleFollowUp,
}: ResourceFormProps) {
  const { t } = useTranslation('admin');
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const statuses = statusList;
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const data = useSelector(selectResource());
  const [inUse, setInUse] = useState(true);
  const hasChanges = useSelector(selectHasChanges());
  const { setView } = useSetView();
  const [userPosted, setUserPosted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [errors, setErrors] = useState(validateForm(data));
  const [updateResource, updateResult] = useUpdateResourceMutation();
  const [createResource, createResult] = useCreateResourceMutation();
  const [togglePropertyShape, toggleResult] = useTogglePropertyShapeMutation();

  const { data: resourceAlreadyExists, isSuccess } = useGetResourceExistsQuery(
    {
      prefix: modelId,
      identifier: data.identifier,
    },
    {
      skip: isEdit || data.identifier === '',
    }
  );

  const { data: inUseResult, isSuccess: isActiveSuccess } =
    useGetResourceActiveQuery({
      prefix: currentModelId,
      uri: `http://uri.suomi.fi/datamodel/ns/${modelId}/${data.identifier}`,
    });

  useEffect(() => {
    if (isActiveSuccess) {
      setInUse(inUseResult);
    }
  }, [isActiveSuccess, inUseResult]);

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
      (isSuccess && resourceAlreadyExists)
    ) {
      return;
    }

    const usedLabels = Object.fromEntries(
      Object.entries(data.label).filter(
        (obj) => languages.includes(obj[0]) && obj[1] !== ''
      )
    );

    const payload = {
      modelId: modelId,
      data: { ...data, label: usedLabels },
      applicationProfile,
    };

    isEdit
      ? updateResource(payload).then(handleToggle)
      : createResource(payload).then(handleToggle);
  };

  const handleToggle = () => {
    if (inUseResult !== inUse) {
      togglePropertyShape({
        modelId: currentModelId,
        uri: `http://uri.suomi.fi/datamodel/ns/${modelId}/${data.identifier}`,
      });
    }
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

  const handleResourceUpdate = (
    value?: {
      label: string;
      uri: string;
    },
    key?: 'equivalentResource' | 'subResourceOf'
  ) => {
    if (!value || !key) {
      return;
    }

    if (
      key === 'subResourceOf' &&
      data.subResourceOf &&
      data.subResourceOf.length === 1 &&
      [
        'owl:topDataProperty',
        'owl:TopObjectProperty',
        'owl:topObjectProperty',
      ].includes(data.subResourceOf[0].uri)
    ) {
      handleUpdate({
        ...data,
        subResourceOf: [value],
      });
      return;
    }

    const initData = Array.isArray(data[key]) ? data[key] : [];

    handleUpdate({
      ...data,
      [key]: [...(initData ?? []), value],
    });
  };

  const handleResourceRemove = (
    id: string,
    key: 'equivalentResource' | 'subResourceOf'
  ) => {
    if (key === 'subResourceOf' && data.subResourceOf?.length === 1) {
      const value =
        data.type === ResourceType.ASSOCIATION
          ? 'owl:TopObjectProperty'
          : 'owl:topDataProperty';
      handleUpdate({
        ...data,
        subResourceOf: [
          {
            label: value,
            uri: value,
          },
        ],
      });
      return;
    }

    handleUpdate({
      ...data,
      [key]: data[key]?.filter((r) => r.uri !== id) ?? [],
    });
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (
      (updateResult.isSuccess || createResult.isSuccess) &&
      (toggleResult.isSuccess ||
        (toggleResult.isUninitialized && inUse === inUseResult))
    ) {
      switch (data.type) {
        case ResourceType.ATTRIBUTE:
          dispatch(
            setNotification(
              updateResult.isSuccess ? 'ATTRIBUTE_EDIT' : 'ATTRIBUTE_ADD'
            )
          );
          break;
        case ResourceType.ASSOCIATION:
          dispatch(
            setNotification(
              updateResult.isSuccess ? 'ASSOCIATION_EDIT' : 'ASSOCIATION_ADD'
            )
          );
      }

      if (handleFollowUp) {
        handleFollowUp(data.identifier, data.type);
        return;
      }

      dispatch(
        setSelected(
          data.identifier,
          data.type === ResourceType.ASSOCIATION ? 'associations' : 'attributes'
        )
      );
      setView(
        data.type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
        'info',
        data.identifier
      );

      if (isEdit && refetch) {
        refetch();
      }

      router.replace(
        `${modelId}/${
          data.type === ResourceType.ASSOCIATION ? 'association' : 'attribute'
        }/${data.identifier}`
      );
    }

    if (
      ref.current &&
      userPosted &&
      (Object.values(errors).filter((val) => val).length > 0 ||
        updateResult.error ||
        createResult.error)
    ) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [
    ref,
    errors,
    userPosted,
    updateResult,
    createResult,
    inUse,
    inUseResult,
    toggleResult,
    handleFollowUp,
    dispatch,
    router,
    modelId,
    data,
    refetch,
    isEdit,
    setView,
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
              translateCommonForm('name', data.type, t)}
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
          updateResult.isError ||
          createResult.isError ||
          (isSuccess && resourceAlreadyExists)) ? (
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
            inUse={inUse}
            setInUse={setInUse}
            type={data.type}
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
                labelText={`${translateCommonForm(
                  'name',
                  data.type,
                  t
                )}, ${lang} (rdfs:label)`}
                value={data.label[lang] ?? ''}
                onChange={(e) =>
                  handleUpdate({
                    ...data,
                    label: { ...data.label, [lang]: e?.toString() ?? '' },
                  })
                }
                status={userPosted && errors.label ? 'error' : 'default'}
                id="label-input"
                maxLength={TEXT_INPUT_MAX}
              />
            ))}
          </LanguageVersionedWrapper>

          <TextInput
            labelText={`${translateCommonForm(
              'identifier',
              data.type,
              t
            )} (dcterms:identifier)`}
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
              (isSuccess && resourceAlreadyExists)
                ? 'error'
                : 'default'
            }
            disabled={isEdit}
            debounce={300}
            statusText={
              isSuccess && resourceAlreadyExists ? t('error-prefix-taken') : ''
            }
            id="prefix-input"
            maxLength={32}
          />

          <RangeAndDomain
            applicationProfile={applicationProfile}
            modelId={modelId}
            data={data}
            handleUpdate={handleUpdate}
          />

          {!applicationProfile && (
            <>
              <InlineListBlock
                label={`${translateCommonForm(
                  'upper',
                  data.type,
                  t
                )} (rdfs:subPropertyOf)`}
                items={
                  data.subResourceOf?.map((resource) => ({
                    id: resource.uri,
                    label: resource.label,
                  })) ?? []
                }
                addNewComponent={
                  <ResourceModal
                    buttonTranslations={{
                      useSelected: translateCommonForm(
                        'add-upper',
                        data.type,
                        t
                      ),
                      openButton: translateCommonForm(
                        'add-upper',
                        data.type,
                        t
                      ),
                    }}
                    handleFollowUp={(e) =>
                      handleResourceUpdate(e, 'subResourceOf')
                    }
                    modelId={modelId}
                    type={data.type}
                    applicationProfile={applicationProfile}
                    buttonIcon
                  />
                }
                deleteDisabled={[
                  'owl:topDataProperty',
                  'owl:TopObjectProperty',
                  'owl:topObjectProperty',
                ]}
                handleRemoval={(id: string) =>
                  handleResourceRemove(id, 'subResourceOf')
                }
              />

              <InlineListBlock
                label={`${translateCommonForm(
                  'equivalent',
                  data.type,
                  t
                )} (owl:equivalentProperty)`}
                items={
                  data.equivalentResource?.map((r) => ({
                    id: r.uri,
                    label: r.label,
                  })) ?? []
                }
                addNewComponent={
                  <ResourceModal
                    buttonTranslations={{
                      useSelected: translateCommonForm(
                        'add-equivalent',
                        data.type,
                        t
                      ),
                      openButton: translateCommonForm(
                        'add-equivalent',
                        data.type,
                        t
                      ),
                    }}
                    handleFollowUp={(e) =>
                      handleResourceUpdate(e, 'equivalentResource')
                    }
                    modelId={modelId}
                    type={data.type}
                    applicationProfile={applicationProfile}
                    buttonIcon
                  />
                }
                optionalText={t('optional')}
                handleRemoval={(id: string) =>
                  handleResourceRemove(id, 'equivalentResource')
                }
              />
            </>
          )}

          <AssociationRestrictions
            modelId={modelId}
            data={data}
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
            errors={errors}
            applicationProfile={applicationProfile}
            handleUpdate={handleUpdateByKey}
            handleUpdateData={handleUpdate}
          />

          <LanguageVersionedWrapper>
            {languages.map((lang) => (
              <Textarea
                key={`label-${lang}`}
                labelText={`${translateCommonForm(
                  'note',
                  data.type,
                  t
                )}, ${lang} (rdfs:comment)`}
                defaultValue={data.note?.[lang] ?? ''}
                onChange={(e) =>
                  handleUpdate({
                    ...data,
                    note: { ...data.note, [lang]: e.target.value ?? '' },
                  })
                }
                optionalText={t('optional')}
                className="wide-text"
                id={`note-input-${lang}`}
                maxLength={TEXT_AREA_MAX}
              />
            ))}
          </LanguageVersionedWrapper>

          <Textarea
            labelText={`${translateCommonForm(
              'work-group-comment',
              data.type,
              t
            )} (dcterms:description)`}
            optionalText={t('optional')}
            defaultValue={data.editorialNote}
            onChange={(e) =>
              handleUpdate({ ...data, editorialNote: e.target.value ?? '' })
            }
            hintText={t('editor-comment-hint')}
            className="wide-text"
            id="editorial-note-input"
            maxLength={TEXT_AREA_MAX}
          />
        </FormWrapper>
      </DrawerContent>
    </>
  );

  function getErrors(): string[] {
    const nanKeys = [
      'maxCount',
      'maxExclusive',
      'maxInclusive',
      'maxLength',
      'minCount',
      'minExclusive',
      'minInclusive',
      'minLength',
    ];

    const hasNanValues =
      Object.entries(errors)
        .filter((e) => nanKeys.includes(e[0]) && e[1])
        .map((e) => e[1])
        .filter(Boolean).length > 0;

    const errorsWithNonNumeric = hasNanValues
      ? Object.fromEntries(
          Object.entries({ ...errors, ...{ nonNumeric: true } }).filter(
            (e) => !nanKeys.includes(e[0])
          )
        )
      : errors;

    const translatedErrors = Object.entries(errorsWithNonNumeric)
      .filter((e) => e[1])
      .map((e) =>
        translateCommonFormErrors(
          e[0],
          data.type === ResourceType.ASSOCIATION
            ? ResourceType.ASSOCIATION
            : ResourceType.ATTRIBUTE,
          t
        )
      );

    if (isSuccess && resourceAlreadyExists) {
      return [...translatedErrors, t('error-prefix-taken')];
    }

    if (updateResult.error) {
      const catchedError = getApiError(updateResult.error);
      return [...translatedErrors, ...catchedError];
    }

    if (createResult.error) {
      const catchedError = getApiError(createResult.error);
      return [...translatedErrors, ...catchedError];
    }
    return translatedErrors;
  }
}
