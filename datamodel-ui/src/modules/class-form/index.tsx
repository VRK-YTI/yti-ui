import {
  Button,
  ExpanderGroup,
  IconArrowLeft,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import { LanguageVersionedWrapper } from './class-form.styles';
import { useTranslation } from 'next-i18next';
import ConceptBlock from '../concept-block';
import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { ClassFormErrors, validateClassForm } from './utils';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import {
  translateClassFormErrors,
  translatePageTitle,
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
import {
  AxiosBaseQueryError,
  AxiosQueryErrorFields,
} from 'yti-common-ui/interfaces/axios-base-query.interface';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';
import { ConceptType } from '@app/common/interfaces/concept-interface';
import ClassModal from '../class-modal';
import {
  InternalClass,
  InternalClassInfo,
} from '@app/common/interfaces/internal-class.interface';
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
import { OWL_THING } from '../class-view/utils';
import { UriData } from '@app/common/interfaces/uri.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';

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
  const { t } = useTranslation('admin');
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const [headerHeight, setHeaderHeight] = useState(99);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useStoreDispatch();
  const data = useSelector(selectClass());
  const hasChanges = useSelector(selectHasChanges());
  const [userPosted, setUserPosted] = useState(false);
  const [isSubClass] = useState(
    data.subClassOf &&
      data.subClassOf.length > 0 &&
      data.subClassOf[0].uri !== OWL_THING.uri
  );
  const [errors, setErrors] = useState<ClassFormErrors>(
    validateClassForm(data)
  );
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [selectedTargetClass, setSelectedTargetClass] = useState<{
    modelId: string;
    identifier: string;
    version?: string;
    classInfo: UriData;
  }>({
    modelId: '',
    identifier: '',
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

  const handleTargetClassUpdate = (value?: InternalClassInfo) => {
    if (!value) {
      return;
    }

    setSelectedTargetClass({
      modelId: getPrefixFromURI(value.namespace) ?? '',
      identifier: value.identifier,
      version: value.dataModelInfo.version,
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
          subClassOf: [OWL_THING],
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
        data.subClassOf[0].uri === OWL_THING.uri
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

    const handleError = (error: AxiosBaseQueryError): void => {
      if (error?.status === 401) {
        setErrors({
          ...validateClassForm(data),
          unauthorized: true,
        });
        return;
      }
      if ('data' in error && (error as AxiosQueryErrorFields).data.details) {
        const asFields = (error as AxiosQueryErrorFields).data.details;
        backendErrorFields = Array.isArray(asFields)
          ? asFields.map((d) => d.field)
          : [];
      }
    };

    if (
      createResult.isError &&
      createResult.error &&
      'data' in createResult.error
    ) {
      handleError(createResult.error);
    } else if (
      updateResult.isError &&
      updateResult.error &&
      'data' in updateResult.error
    ) {
      handleError(updateResult.error);
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
            {isEdit
              ? t('return-to-class')
              : t('return-to-class-list', { ns: 'common' })}
          </Button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => handleSubmit()}
              id={
                updateResult.isLoading || createResult.isLoading
                  ? 'submit-button_submitted'
                  : 'submit-button'
              }
            >
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
            {isEdit
              ? translatePageTitle(
                  'edit',
                  ResourceType.CLASS,
                  t,
                  applicationProfile
                )
              : translatePageTitle(
                  isSubClass ? 'create-sub' : 'create',
                  ResourceType.CLASS,
                  t,
                  applicationProfile
                )}
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
                Object.keys(errors).filter((key) => {
                  const l: Array<keyof typeof errors> = [
                    'identifier',
                    'identifierInitChar',
                    'identifierLength',
                    'identifierCharacters',
                    'label',
                  ];
                  return (
                    (l as string[]).includes(key) &&
                    errors[key as keyof typeof errors] === true
                  );
                }).length > 0
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
          labelText={`${t('class-identifier', {
            ns: 'common',
          })} (dcterms:identifier)`}
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
              <Text>{t('tooltip.class-identifier', { ns: 'common' })}</Text>
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
                hiddenClasses={[
                  data.uri,
                  ...(data.subClassOf?.map((s) => s.uri) ?? []),
                ]}
              />
            }
            items={data.subClassOf}
            label={`${t('upper-classes')} (rdfs:subClassOf)`}
            tooltip={{
              text: t('tooltip.upper-classes', { ns: 'common' }),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
            handleRemoval={(id: string) =>
              handleClassOfRemoval(id, 'subClassOf')
            }
            deleteDisabled={[OWL_THING.uri]}
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
                  hiddenClasses={[data.uri]}
                />
              }
              items={data.targetClass ? [data.targetClass] : []}
              label={`${t('target-class-profile')} (sh:targetClass)`}
              tooltip={{
                text: t('tooltip.target-class-profile', { ns: 'common' }),
                ariaCloseButtonLabelText: '',
                ariaToggleButtonLabelText: '',
              }}
              handleRemoval={() =>
                handleUpdate({ ...data, targetClass: undefined })
              }
              deleteDisabled={true}
            />

            <ResourcePicker
              visible={showResourcePicker}
              selectedNodeShape={{
                modelId: selectedTargetClass.modelId,
                classId: selectedTargetClass.identifier,
                version: selectedTargetClass.version,
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
                hiddenClasses={[
                  data.uri,
                  ...(data.equivalentClass?.map((s) => s.uri) ?? []),
                ]}
              />
            }
            items={data.equivalentClass}
            label={`${t('equivalent-classes', {
              ns: 'common',
            })} (owl:equivalentClass)`}
            tooltip={{
              text: t('tooltip.equivalent-classes', { ns: 'common' }),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
            handleRemoval={(id: string) =>
              handleClassOfRemoval(id, 'equivalentClass')
            }
          />
        )}

        {applicationProfile ? (
          <>
            {data.node?.curie}
            <InlineListBlock
              label={`${t('utilizes-class-restriction', {
                ns: 'common',
              })} (sh:node)`}
              tooltip={{
                text: t('tooltip.utilizes-class-restriction', { ns: 'common' }),
                ariaCloseButtonLabelText: '',
                ariaToggleButtonLabelText: '',
              }}
              addNewComponent={
                <ClassModal
                  modelId={modelId}
                  mode={'select'}
                  modalButtonLabel={t('select-class-restriction')}
                  handleFollowUp={handleUtilizedNodeUpdate}
                  initialSelected={data.node?.uri}
                  applicationProfile
                  limitToModelType="PROFILE"
                  hiddenClasses={[data.uri]}
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
                hiddenClasses={[
                  data.uri,
                  ...(data.disjointWith?.map((s) => s.uri) ?? []),
                ]}
              />
            }
            tooltip={{
              text: t('tooltip.disjoint-classes', { ns: 'common' }),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
            items={data.disjointWith}
            handleRemoval={(id) => handleClassOfRemoval(id, 'disjointWith')}
          />
        )}

        <LanguageVersionedWrapper>
          {languages.map((lang) => (
            <Textarea
              key={`comment-${lang}`}
              labelText={`${t('technical-description', {
                ns: 'common',
              })}, ${lang} ${
                applicationProfile ? '(sh:description)' : '(rdfs:comment)'
              }`}
              tooltipComponent={
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                >
                  {t('tooltip.technical-description', { ns: 'common' })}
                </Tooltip>
              }
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
              ? `${t('attributes', { ns: 'common' })} (sh:PropertyShape)`
              : t('attributes', { ns: 'common' })
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
                    handlePropertiesUpdate={() => {
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
              ? `${t('associations', { ns: 'common' })} (sh:PropertyShape)`
              : t('associations', { ns: 'common' })
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
                    disableAssocTarget={true}
                    handlePropertiesUpdate={() => {
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
