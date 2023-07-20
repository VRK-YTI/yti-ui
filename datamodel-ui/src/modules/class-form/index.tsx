import {
  Button,
  Dropdown,
  DropdownItem,
  ExpanderGroup,
  IconArrowLeft,
  IconPlus,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import { LanguageVersionedWrapper } from './class-form.styles';
import { useTranslation } from 'next-i18next';
import { Status } from '@app/common/interfaces/status.interface';
import ConceptBlock from '../concept-block';
import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { ClassFormErrors, validateClassForm } from './utils';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import { statusList } from 'yti-common-ui/utils/status-list';
import {
  translateClassFormErrors,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { useEffect, useRef, useState } from 'react';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import InlineListBlock from '@app/common/components/inline-list-block';
import {
  selectClass,
  setClass,
  useCreateClassMutation,
  useGetClassExistsQuery,
  useUpdateClassMutation,
} from '@app/common/components/class/class.slice';
import { AxiosQueryErrorFields } from 'yti-common-ui/interfaces/axios-base-query.interface';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';
import { ConceptType } from '@app/common/interfaces/concept-interface';
import ClassModal from '../class-modal';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { BasicBlock } from 'yti-common-ui/block';
import ResourceInfo from '../class-view/resource-info';
import getApiError from '@app/common/utils/get-api-errors';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import {
  selectHasChanges,
  setHasChanges,
} from '@app/common/components/model/model.slice';
import ResourcePicker from '../resource-picker-modal';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';
import { getCurie } from '@app/common/utils/get-value';

export interface ClassFormProps {
  handleReturn: () => void;
  handleFollowUp: (value: string) => void;
  languages: string[];
  modelId: string;
  terminologies: string[];
  isEdit: boolean;
  applicationProfile?: boolean;
  basedOnNodeShape?: boolean;
}

export default function ClassForm({
  handleReturn,
  handleFollowUp,
  languages,
  modelId,
  terminologies,
  isEdit,
  applicationProfile,
  basedOnNodeShape,
}: ClassFormProps) {
  const { t, i18n } = useTranslation('admin');
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useStoreDispatch();
  const data = useSelector(selectClass());
  const hasChanges = useSelector(selectHasChanges());
  const [userPosted, setUserPosted] = useState(false);
  const [errors, setErrors] = useState<ClassFormErrors>(
    validateClassForm(data)
  );
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [selectedTargetClass, setSelectedTargetClass] = useState<{
    modelId: string;
    classInfo: {
      id: string;
      identifier: string;
      label: string;
    };
  }>({
    modelId: '',
    classInfo: {
      id: '',
      identifier: '',
      label: '',
    },
  });
  const [updateClass, updateResult] = useUpdateClassMutation();
  const [createClass, createResult] = useCreateClassMutation();

  const { data: classAlreadyExists, isSuccess } = useGetClassExistsQuery(
    { prefix: modelId, identifier: data.identifier },
    { skip: isEdit || data.identifier === '' }
  );

  const handleUpdate = (value: ClassFormType) => {
    if (
      userPosted &&
      Object.values(errors).filter((val) => val === true).length > 0
    ) {
      setErrors(validateClassForm(value));
    }
    enableConfirmation();
    dispatch(setHasChanges(true));
    dispatch(setClass(value));
  };

  const handleSubmit = () => {
    disableConfirmation();
    dispatch(setHasChanges(false));

    if (!userPosted) {
      setUserPosted(true);
    }

    const errors = validateClassForm(data);
    setErrors(errors);

    if (
      Object.values(errors).filter((val) => val === true).length > 0 ||
      (isSuccess && classAlreadyExists)
    ) {
      return;
    }

    const usedLabels = Object.fromEntries(
      Object.entries(data.label).filter((obj) => obj[1] !== '')
    );

    const payload = {
      modelId: modelId,
      data: {
        ...data,
        label: Object.keys(usedLabels).length > 0 ? usedLabels : {},
      },
      applicationProfile,
      basedOnNodeShape: basedOnNodeShape,
    };

    isEdit ? updateClass(payload) : createClass(payload);
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

  const handleTargetClassUpdate = (value?: InternalClass) => {
    if (!value) {
      return;
    }

    setSelectedTargetClass({
      modelId: value.namespace.split('/').filter(Boolean).pop() ?? '',
      classInfo: {
        identifier: value.identifier,
        id: value.id,
        label: `${getCurie(value.namespace, value.identifier)}`,
      },
    });
    setShowResourcePicker(true);
  };

  const handleResourceUpdate = (value?: {
    associations: SimpleResource[];
    attributes: SimpleResource[];
  }) => {
    setShowResourcePicker(false);
    const targetClass = {
      id: selectedTargetClass.classInfo.id,
      label: selectedTargetClass.classInfo.label,
      identifier: selectedTargetClass.classInfo.identifier,
    };
    handleUpdate({
      ...data,
      targetClass: targetClass,
      association: value?.associations ?? [],
      attribute: value?.attributes ?? [],
    });
  };

  const handleClassOfRemoval = (
    id: string,
    key: 'subClassOf' | 'equivalentClass'
  ) => {
    if (key === 'subClassOf') {
      const newSubClasses = data.subClassOf
        ? data.subClassOf.filter((subclass) => subclass.identifier !== id)
        : [];

      if (newSubClasses.length < 1) {
        handleUpdate({
          ...data,
          subClassOf: [
            {
              identifier: 'owl:Thing',
              label: 'owl:Thing',
            },
          ],
        });
      } else {
        handleUpdate({
          ...data,
          subClassOf: newSubClasses,
        });
      }
      return;
    }

    handleUpdate({
      ...data,
      [key]: data.equivalentClass
        ? data.equivalentClass.filter((item) => item.identifier !== id)
        : [],
    });
  };

  const handleClassUpdate = (
    value?: InternalClass,
    key?: keyof ClassFormType
  ) => {
    if (!value || !key) {
      return;
    }

    if (key === 'subClassOf') {
      const initData =
        data.subClassOf &&
        data.subClassOf.length === 1 &&
        data.subClassOf[0].identifier === 'owl:Thing'
          ? []
          : data.subClassOf ?? [];

      handleUpdate({
        ...data,
        subClassOf: [
          ...initData,
          {
            identifier: value.id,
            label: `${getCurie(value.namespace, value.identifier)}`,
          },
        ],
      });
      return;
    }

    if (key === 'equivalentClass') {
      handleUpdate({
        ...data,
        equivalentClass: [
          ...(data.equivalentClass ?? []),
          {
            label: `${getCurie(value.namespace, value.identifier)}`,
            identifier: value.id,
          },
        ],
      });
      return;
    }
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (
      ref.current &&
      (Object.values(errors).filter((val) => val).length > 0 ||
        updateResult.isError ||
        createResult.isError)
    ) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, errors, updateResult, createResult]);

  useEffect(() => {
    if (updateResult.isSuccess || createResult.isSuccess) {
      handleFollowUp(data.identifier);
    }

    let backendErrorFields: string[] = [];
    if (
      createResult.isError &&
      createResult.error &&
      'data' in createResult.error
    ) {
      if (createResult.error?.status === 401) {
        setErrors({
          ...validateClassForm(data),
          unauthorized: true,
        });
        return;
      }
      const asFields = (createResult.error as AxiosQueryErrorFields).data
        ?.details;
      backendErrorFields = Array.isArray(asFields)
        ? asFields.map((d) => d.field)
        : [];
    } else if (
      updateResult.isError &&
      updateResult.error &&
      'data' in updateResult.error
    ) {
      if (updateResult.error?.status === 401) {
        setErrors({
          ...validateClassForm(data),
          unauthorized: true,
        });
        return;
      }
      const asFields = (updateResult.error as AxiosQueryErrorFields).data
        ?.details;
      backendErrorFields = Array.isArray(asFields)
        ? asFields.map((d) => d.field)
        : [];
    }

    if (backendErrorFields.length > 0) {
      setErrors({
        identifier: backendErrorFields.includes('identifier'),
        identifierInitChar: false,
        identifierLength: false,
        label: backendErrorFields.includes('label'),
      });
    }
  }, [updateResult, createResult, data, handleFollowUp]);

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

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="bold">
            {Object.values(data.label).filter(
              (l) => l !== '' && typeof l !== 'undefined'
            ).length > 0
              ? getLanguageVersion({
                  data: Object.fromEntries(
                    Object.entries(data.label).filter(
                      (l) => l[1] !== '' && typeof l[1] !== 'undefined'
                    )
                  ),
                  lang: i18n.language,
                  appendLocale: true,
                })
              : t('class-name')}
          </Text>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={() => handleSubmit()} id="submit-button">
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
        (Object.values(errors).filter((e) => e).length > 0 ||
          updateResult.isError ||
          createResult.isError ||
          (isSuccess && classAlreadyExists)) ? (
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

      <DrawerContent height={headerHeight} spaced>
        <ConceptBlock
          concept={data.concept}
          setConcept={handleSetConcept}
          terminologies={terminologies}
        />

        <LanguageVersionedWrapper>
          {languages.map((lang) => (
            <TextInput
              key={`label-${lang}`}
              labelText={`${t('class-name')}, ${lang}`}
              value={data.label[lang] ?? ''}
              onChange={(e) =>
                handleUpdate({
                  ...data,
                  label: { ...data.label, [lang]: e?.toString() ?? '' },
                })
              }
              status={userPosted && errors.label ? 'error' : 'default'}
              fullWidth
              id="label-input"
            />
          ))}
        </LanguageVersionedWrapper>

        <TextInput
          labelText={t('class-identifier')}
          visualPlaceholder={t('input-class-identifier')}
          defaultValue={data.identifier}
          status={
            (userPosted &&
              (errors.identifier ||
                errors.identifierInitChar ||
                errors.identifierLength)) ||
            (isSuccess && classAlreadyExists)
              ? 'error'
              : 'default'
          }
          disabled={isEdit}
          onChange={(e) =>
            handleUpdate({ ...data, identifier: e?.toString() ?? '' })
          }
          debounce={300}
          statusText={
            isSuccess && classAlreadyExists ? t('error-prefix-taken') : ''
          }
          tooltipComponent={
            <Tooltip
              ariaToggleButtonLabelText={''}
              ariaCloseButtonLabelText={''}
            >
              <Text>Tooltip sisältö</Text>
            </Tooltip>
          }
          id="prefix-input"
        />

        {!applicationProfile ? (
          <InlineListBlock
            addNewComponent={
              <ClassModal
                modelId={modelId}
                handleFollowUp={(e) => handleClassUpdate(e, 'subClassOf')}
                mode={'select'}
                applicationProfile={applicationProfile}
                modalButtonLabel={t('add-upper-class')}
                plusIcon
              />
            }
            items={
              data.subClassOf && data.subClassOf.length > 0
                ? data.subClassOf.map((s) => ({
                    label: s.label,
                    id: s.identifier,
                  }))
                : []
            }
            label={t('upper-classes')}
            handleRemoval={(id: string) =>
              handleClassOfRemoval(id, 'subClassOf')
            }
            deleteDisabled={['owl:Thing']}
          />
        ) : (
          <></>
        )}

        {applicationProfile ? (
          <>
            <InlineListBlock
              addNewComponent={
                <ClassModal
                  modelId={modelId}
                  mode={'select'}
                  modalButtonLabel={t('select-class')}
                  handleFollowUp={handleTargetClassUpdate}
                  initialSelected={data.targetClass?.id}
                  applicationProfile
                  resourceRestriction
                />
              }
              items={data.targetClass ? [data.targetClass] : []}
              label={t('target-class-profile')}
              handleRemoval={() =>
                handleUpdate({ ...data, targetClass: undefined })
              }
            />

            <ResourcePicker
              visible={showResourcePicker}
              selectedNodeShape={{
                modelId: selectedTargetClass.modelId,
                classId: selectedTargetClass.classInfo.identifier,
                isAppProfile: false,
              }}
              handleFollowUp={handleResourceUpdate}
            />
          </>
        ) : (
          <InlineListBlock
            addNewComponent={
              <ClassModal
                modelId={modelId}
                handleFollowUp={(e) => handleClassUpdate(e, 'equivalentClass')}
                mode={'select'}
                applicationProfile={applicationProfile}
                modalButtonLabel={t('add-corresponding-class')}
                plusIcon
              />
            }
            items={
              data.equivalentClass
                ? data.equivalentClass.map((ec) => ({
                    label: ec.label,
                    id: ec.identifier,
                  }))
                : []
            }
            label={t('corresponding-classes')}
            handleRemoval={(id: string) =>
              handleClassOfRemoval(id, 'equivalentClass')
            }
          />
        )}

        {applicationProfile ? (
          <InlineListBlock
            label={t('utilizes-class-restriction')}
            addNewComponent={
              <Button
                variant="secondary"
                icon={<IconPlus />}
                id="select-class-restriction-button"
              >
                {t('select-class-restriction')}
              </Button>
            }
            items={data.node ? [data.node] : []}
            handleRemoval={() => handleUpdate({ ...data, node: undefined })}
          />
        ) : (
          <InlineListBlock
            label={t('disjoint-classes', { ns: 'common' })}
            addNewComponent={
              <ClassModal
                modelId={modelId}
                handleFollowUp={() => null}
                mode={'select'}
                applicationProfile={applicationProfile}
                modalButtonLabel={t('add-disjoint-class')}
                plusIcon
              />
            }
            items={[]}
            handleRemoval={() => null}
          />
        )}

        <div>
          <Dropdown
            labelText={t('status')}
            defaultValue={data.status}
            onChange={(e) => handleUpdate({ ...data, status: e as Status })}
            id="status-dropdown"
          >
            {statusList.map((status) => (
              <DropdownItem key={status} value={status}>
                {translateStatus(status, t)}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>

        <LanguageVersionedWrapper>
          {languages.map((lang) => (
            <Textarea
              key={`comment-${lang}`}
              labelText={`${t('technical-description')}, ${lang}`}
              optionalText={t('optional')}
              defaultValue={data.note[lang as keyof typeof data.note]}
              onChange={(e) =>
                handleUpdate({
                  ...data,
                  note: { ...data.note, [lang]: e.target.value },
                })
              }
              fullWidth
              id="comment-input"
            />
          ))}
        </LanguageVersionedWrapper>

        <Separator />

        <BasicBlock title={t('attributes')}>
          {(!applicationProfile && !isEdit) ||
          !data.attribute ||
          data.attribute.length < 1 ? (
            t('no-attributes', { ns: 'common' })
          ) : (
            <ExpanderGroup
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              {data.attribute.map((attr) => (
                <div key={`${data.identifier}-attr-${attr.identifier}`}>
                  <ResourceInfo
                    key={`${data.identifier}-attr-${attr.identifier}`}
                    data={attr}
                    modelId={modelId}
                    classId={data.identifier}
                    applicationProfile={applicationProfile}
                    hasPermission
                    handlePropertyDelete={() => {
                      const newAttributes = data.attribute
                        ? data.attribute.filter(
                            (attribute) =>
                              attribute.identifier !== attr.identifier
                          )
                        : [];
                      handleUpdate({ ...data, attribute: newAttributes });
                    }}
                    attribute
                  />
                  {applicationProfile && (
                    <Button
                      variant="secondary"
                      style={{ marginTop: '10px' }}
                      id="add-attribute-button"
                    >
                      {t('add-attribute')}
                    </Button>
                  )}
                </div>
              ))}
            </ExpanderGroup>
          )}
        </BasicBlock>

        <BasicBlock title={t('associations')}>
          {(!applicationProfile && !isEdit) ||
          !data.association ||
          data.association.length < 1 ? (
            t('no-assocations', { ns: 'common' })
          ) : (
            <ExpanderGroup
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              {data.association.map((assoc) => (
                <div key={`${data.identifier}-assoc-${assoc.identifier}`}>
                  <ResourceInfo
                    data={assoc}
                    modelId={modelId}
                    classId={data.identifier}
                    applicationProfile={applicationProfile}
                    hasPermission
                    handlePropertyDelete={() => {
                      const newAssociations = data.association
                        ? data.association.filter(
                            (association) =>
                              association.identifier !== assoc.identifier
                          )
                        : [];
                      handleUpdate({ ...data, association: newAssociations });
                    }}
                  />
                  {applicationProfile && (
                    <Button
                      variant="secondary"
                      style={{ marginTop: '10px' }}
                      id="add-association-button"
                    >
                      {t('add-association')}
                    </Button>
                  )}
                </div>
              ))}
            </ExpanderGroup>
          )}
        </BasicBlock>

        <Separator />

        <Textarea
          labelText={t('work-group-comment')}
          optionalText={t('optional')}
          hintText={t('editor-comment-hint')}
          defaultValue={data.editorialNote}
          onChange={(e) =>
            handleUpdate({ ...data, editorialNote: e.target.value })
          }
          fullWidth
          id="editor-comment-input"
        />
      </DrawerContent>
    </>
  );

  function getErrors(): string[] {
    const translatedErrors = Object.entries(errors)
      .filter((e) => e[1])
      .map((e) => translateClassFormErrors(e[0], t));

    if (isSuccess && classAlreadyExists) {
      return [...translatedErrors, t('error-prefix-taken')];
    }

    if (updateResult.error) {
      const catchedError = getApiError(updateResult.error);
      return [...translatedErrors, ...catchedError];
    } else if (createResult.error) {
      const catchedError = getApiError(createResult.error);
      return [...translatedErrors, ...catchedError];
    }
    return translatedErrors;
  }
}
