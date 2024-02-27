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
  translatePageTitle,
  translateCommonTooltips,
} from '@app/common/utils/translation-helpers';
import ConceptBlock from '@app/modules/concept-block';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconArrowLeft } from 'suomifi-icons';
import {
  Button,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { FormWrapper, LanguageVersionedWrapper } from './resource-form.styles';
import validateForm from './validate-form';
import { ConceptType } from '@app/common/interfaces/concept-interface';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import {
  selectHasChanges,
  setHasChanges,
  setSelected,
  setUpdateVisualization,
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
import { HeaderRow, StyledSpinner } from '@app/common/components/header';
import { UriData } from '@app/common/interfaces/uri.interface';
import {
  DEFAULT_ASSOCIATION_SUBPROPERTY,
  DEFAULT_ATTRIBUTE_SUBPROPERTY,
} from '@app/common/components/resource/utils';
import PropertyToggle from './components/property-toggle';
import { SUOMI_FI_NAMESPACE } from '@app/common/utils/get-value';

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
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const data = useSelector(selectResource());
  const [inUse, setInUse] = useState(true);
  const [isSubResource] = useState(
    !applicationProfile &&
      data.subResourceOf &&
      data.subResourceOf.length > 0 &&
      data.subResourceOf[0].curie !== 'owl:topDataProperty' &&
      data.subResourceOf[0].curie !== 'owl:topObjectProperty'
  );
  const hasChanges = useSelector(selectHasChanges());
  const { setView } = useSetView();
  const [userPosted, setUserPosted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(99);
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
      uri: `${SUOMI_FI_NAMESPACE}${modelId}/${data.identifier}`,
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
        uri: `${SUOMI_FI_NAMESPACE}${modelId}/${data.identifier}`,
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
    value?: UriData,
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
        DEFAULT_ASSOCIATION_SUBPROPERTY.uri,
        DEFAULT_ATTRIBUTE_SUBPROPERTY.uri,
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
      const defaultSubResourceOf =
        data.type === ResourceType.ASSOCIATION
          ? DEFAULT_ASSOCIATION_SUBPROPERTY
          : DEFAULT_ATTRIBUTE_SUBPROPERTY;
      handleUpdate({
        ...data,
        subResourceOf: [defaultSubResourceOf],
      });
      return;
    }

    handleUpdate({
      ...data,
      [key]: data[key]?.filter((r: UriData) => r.uri !== id) ?? [],
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
          data.type === ResourceType.ASSOCIATION
            ? 'associations'
            : 'attributes',
          modelId
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
      dispatch(setUpdateVisualization(true));
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
            className="long-text"
            id="back-button"
          >
            {isEdit
              ? translatePageTitle(
                  'return-to-resource',
                  data.type,
                  t,
                  applicationProfile
                )
              : translatePageTitle(
                  'return-to-list',
                  data.type,
                  t,
                  applicationProfile
                )}
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
              ? translatePageTitle('edit', data.type, t, applicationProfile)
              : translatePageTitle(
                  isSubResource ? 'create-sub' : 'create',
                  data.type,
                  t,
                  applicationProfile
                )}
          </Text>
        </HeaderRow>

        {userPosted &&
        (Object.values(errors).filter((val) => val).length > 0 ||
          updateResult.isError ||
          createResult.isError ||
          (isSuccess && resourceAlreadyExists)) ? (
          <div>
            <FormFooterAlert
              labelText={
                Object.keys(errors).filter((key) => {
                  const l: Array<keyof typeof errors> = [
                    'label',
                    'identifier',
                    'identifierInitChar',
                    'identifierLength',
                    'identifierCharacters',
                    'maxCount',
                    'maxExclusive',
                    'maxInclusive',
                    'maxLength',
                    'minCount',
                    'minExclusive',
                    'minInclusive',
                    'minLength',
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
            tooltipComponent={
              <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
                {translateCommonTooltips('identifier', data.type, t)}
              </Tooltip>
            }
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
                  errors.identifierLength ||
                  errors.identifierCharacters)) ||
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
                tooltip={{
                  text: translateCommonTooltips('upper', data.type, t),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
                items={data.subResourceOf}
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
                    hiddenResources={[
                      data.uri,
                      ...(data.subResourceOf?.map((s) => s.uri) ?? []),
                    ]}
                  />
                }
                deleteDisabled={[
                  DEFAULT_ASSOCIATION_SUBPROPERTY.uri,
                  DEFAULT_ATTRIBUTE_SUBPROPERTY.uri,
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
                tooltip={{
                  text: translateCommonTooltips('equivalent', data.type, t),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
                items={data.equivalentResource}
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
                    hiddenResources={[
                      data.uri,
                      ...(data.equivalentResource?.map((s) => s.uri) ?? []),
                    ]}
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

          {!applicationProfile && (
            <>
              <PropertyToggle
                label={`${translateCommonForm(
                  'functional',
                  data.type,
                  t
                )} (owl:FunctionalProperty)`}
                tooltip={{
                  text: translateCommonTooltips('functional', data.type, t),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
                handleUpdate={(value) =>
                  handleUpdate({
                    ...data,
                    functionalProperty: value ?? undefined,
                  })
                }
                value={data.functionalProperty}
                id="functional-property-toggle"
                optionalText={t('optional')}
              />
              {data.type === ResourceType.ASSOCIATION && (
                <>
                  <PropertyToggle
                    label={`${translateCommonForm(
                      'transitive',
                      data.type,
                      t
                    )} (owl:TransitiveProperty)`}
                    tooltip={{
                      text: translateCommonTooltips('transitive', data.type, t),
                      ariaCloseButtonLabelText: '',
                      ariaToggleButtonLabelText: '',
                    }}
                    handleUpdate={(value) =>
                      handleUpdate({
                        ...data,
                        transitiveProperty: value ?? undefined,
                      })
                    }
                    value={data.transitiveProperty}
                    id="transitive-property-toggle"
                    optionalText={t('optional')}
                  />
                  <PropertyToggle
                    label={`${translateCommonForm(
                      'reflexive',
                      data.type,
                      t
                    )} (owl:ReflexiveProperty)`}
                    tooltip={{
                      text: translateCommonTooltips('reflexive', data.type, t),
                      ariaCloseButtonLabelText: '',
                      ariaToggleButtonLabelText: '',
                    }}
                    handleUpdate={(value) =>
                      handleUpdate({
                        ...data,
                        reflexiveProperty: value ?? undefined,
                      })
                    }
                    value={data.reflexiveProperty}
                    id="reflexive-property-toggle"
                    optionalText={t('optional')}
                  />
                </>
              )}
            </>
          )}

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
                tooltipComponent={
                  <Tooltip
                    ariaCloseButtonLabelText=""
                    ariaToggleButtonLabelText=""
                  >
                    {t('tooltip.technical-description', { ns: 'common' })}
                  </Tooltip>
                }
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
