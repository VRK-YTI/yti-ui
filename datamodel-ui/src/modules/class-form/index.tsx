import {
  Button,
  Dropdown,
  DropdownItem,
  ExpanderGroup,
  IconArrowLeft,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
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
import { getPrefixFromURI } from '@app/common/utils/get-value';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import {
  IDENTIFIER_MAX,
  TEXT_AREA_MAX,
  TEXT_INPUT_MAX,
} from 'yti-common-ui/utils/constants';
import { HeaderRow, StyledSpinner } from '@app/common/components/header';
import { DEFAULT_SUBCLASS_OF } from '../class-view/utils';
import { UriData } from '@app/common/interfaces/uri.interface';
import { LanguageVersionedWrapper } from './class-form.styles';

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
    classInfo: UriData;
  }>({
    modelId: '',
    classInfo: {
      uri: '',
      curie: '',
      label: {},
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
      Object.entries(data.label).filter(
        (obj) => languages.includes(obj[0]) && obj[1] !== ''
      )
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
      modelId: getPrefixFromURI(value.namespace) ?? '',
      classInfo: convertToUriData(value),
    });
    setShowResourcePicker(true);
  };

  const handleUtilizedNodeUpdate = (value?: InternalClass) => {
    if (!value) {
      return;
    }

    handleUpdate({
      ...data,
      node: convertToUriData(value),
    });
  };

  const handleResourceUpdate = (value?: {
    associations: SimpleResource[];
    attributes: SimpleResource[];
  }) => {
    setShowResourcePicker(false);
    handleUpdate({
      ...data,
      targetClass: selectedTargetClass.classInfo,
      association: value?.associations ?? [],
      attribute: value?.attributes ?? [],
    });
  };

  const handleClassOfRemoval = (
    id: string,
    key: 'subClassOf' | 'equivalentClass' | 'disjointWith'
  ) => {
    if (key === 'subClassOf') {
      const newSubClasses = data.subClassOf
        ? data.subClassOf.filter((subclass) => subclass.uri !== id)
        : [];

      if (newSubClasses.length < 1) {
        handleUpdate({
          ...data,
          subClassOf: [DEFAULT_SUBCLASS_OF],
        });
      } else {
        handleUpdate({
          ...data,
          subClassOf: newSubClasses,
        });
      }
      return;
    }
    if (key === 'equivalentClass') {
      handleUpdate({
        ...data,
        equivalentClass: data.equivalentClass
          ? data.equivalentClass.filter((item) => item.uri !== id)
          : [],
      });
      return;
    }
    if (key === 'disjointWith') {
      handleUpdate({
        ...data,
        disjointWith: data.disjointWith
          ? data.disjointWith.filter((item) => item.uri !== id)
          : [],
      });
    }
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
        data.subClassOf[0].uri === 'owl:Thing'
          ? []
          : data.subClassOf ?? [];

      handleUpdate({
        ...data,
        subClassOf: [...initData, convertToUriData(value)],
      });
      return;
    }

    if (key === 'equivalentClass') {
      handleUpdate({
        ...data,
        equivalentClass: [
          ...(data.equivalentClass ?? []),
          convertToUriData(value),
        ],
      });
      return;
    }

    if (key === 'disjointWith') {
      handleUpdate({
        ...data,
        disjointWith: [...(data.disjointWith ?? []), convertToUriData(value)],
      });
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
      dispatch(
        setNotification(updateResult.isSuccess ? 'CLASS_EDIT' : 'CLASS_ADD')
      );
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
        identifierCharacters: false,
        label: backendErrorFields.includes('label'),
      });
    }
  }, [updateResult, createResult, data, dispatch, handleFollowUp]);

  const convertToUriData = (data: InternalClass) => {
    return {
      uri: data.id,
      curie: data.curie,
      label: data.label,
    };
  };

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

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={() => handleSubmit()} id="submit-button">
              {updateResult.isLoading || createResult.isLoading ? (
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

        <HeaderRow>
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
        </HeaderRow>

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
              labelText={`${t('class-name')}, ${lang} (rdfs:label)`}
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
              maxLength={TEXT_INPUT_MAX}
            />
          ))}
        </LanguageVersionedWrapper>

        <TextInput
          labelText={`${t('class-identifier')} (dcterms:identifier)`}
          visualPlaceholder={t('input-class-identifier')}
          defaultValue={data.identifier}
          status={
            (userPosted &&
              (errors.identifier ||
                errors.identifierInitChar ||
                errors.identifierLength ||
                errors.identifierCharacters)) ||
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
          maxLength={IDENTIFIER_MAX}
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
            items={data.subClassOf}
            label={`${t('upper-classes')} (rdfs:subClassOf)`}
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
                  initialSelected={data.targetClass?.uri}
                  applicationProfile
                />
              }
              items={data.targetClass ? [data.targetClass] : []}
              label={`${t('target-class-profile')} (sh:targetClass)`}
              handleRemoval={() =>
                handleUpdate({ ...data, targetClass: undefined })
              }
            />

            <ResourcePicker
              visible={showResourcePicker}
              selectedNodeShape={{
                modelId: selectedTargetClass.modelId,
                classId: selectedTargetClass.classInfo.uri,
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
            items={data.equivalentClass}
            label={`${t('corresponding-classes')} (owl:equivalentClass)`}
            handleRemoval={(id: string) =>
              handleClassOfRemoval(id, 'equivalentClass')
            }
          />
        )}

        {applicationProfile ? (
          <>
            {data.node?.curie}
            <InlineListBlock
              label={`${t('utilizes-class-restriction')} (sh:node)`}
              addNewComponent={
                <ClassModal
                  modelId={modelId}
                  mode={'select'}
                  modalButtonLabel={t('select-class-restriction')}
                  handleFollowUp={handleUtilizedNodeUpdate}
                  initialSelected={data.node?.uri}
                  applicationProfile
                  limitToModelType="PROFILE"
                />
              }
              items={data.node ? [data.node] : []}
              handleRemoval={() => handleUpdate({ ...data, node: undefined })}
            />
          </>
        ) : (
          <InlineListBlock
            label={`${t('disjoint-classes', {
              ns: 'common',
            })} (owl:disjointWith)`}
            addNewComponent={
              <ClassModal
                modelId={modelId}
                handleFollowUp={(e) => handleClassUpdate(e, 'disjointWith')}
                mode={'select'}
                applicationProfile={applicationProfile}
                modalButtonLabel={t('add-disjoint-class')}
                plusIcon
              />
            }
            items={data.disjointWith}
            handleRemoval={(id) => handleClassOfRemoval(id, 'disjointWith')}
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
              labelText={`${t('technical-description')}, ${lang} ${
                applicationProfile ? '(sh:description)' : '(rdfs:comment)'
              }`}
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
              maxLength={TEXT_AREA_MAX}
            />
          ))}
        </LanguageVersionedWrapper>

        <Separator />

        <BasicBlock
          title={
            applicationProfile
              ? `${t('attributes')} (sh:PropertyShape)`
              : t('attributes')
          }
        >
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
                </div>
              ))}
            </ExpanderGroup>
          )}
        </BasicBlock>

        <BasicBlock
          title={
            applicationProfile
              ? `${t('associations')} (sh:PropertyShape)`
              : t('associations')
          }
        >
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
                </div>
              ))}
            </ExpanderGroup>
          )}
        </BasicBlock>

        <Separator />

        <Textarea
          labelText={`${t('work-group-comment')} (dcterms:description)`}
          optionalText={t('optional')}
          hintText={t('editor-comment-hint')}
          defaultValue={data.editorialNote}
          onChange={(e) =>
            handleUpdate({ ...data, editorialNote: e.target.value })
          }
          fullWidth
          id="editor-comment-input"
          maxLength={TEXT_AREA_MAX}
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
