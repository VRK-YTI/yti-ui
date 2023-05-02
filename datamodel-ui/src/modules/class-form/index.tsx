import {
  Button,
  Dropdown,
  DropdownItem,
  ExpanderGroup,
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
  usePutClassMutation,
} from '@app/common/components/class/class.slice';
import {
  AxiosBaseQueryError,
  AxiosQueryErrorFields,
} from 'yti-common-ui/interfaces/axios-base-query.interface';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';
import { ConceptType } from '@app/common/interfaces/concept-interface';
import ClassModal from '../class-modal';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { BasicBlock } from 'yti-common-ui/block';
import ResourceInfo from '../class-view/resource-info';

export interface ClassFormProps {
  handleReturn: () => void;
  handleFollowUp: (value: string) => void;
  languages: string[];
  modelId: string;
  terminologies: string[];
  isEdit: boolean;
  applicationProfile?: boolean;
}

export default function ClassForm({
  handleReturn,
  handleFollowUp,
  languages,
  modelId,
  terminologies,
  isEdit,
  applicationProfile,
}: ClassFormProps) {
  const { t, i18n } = useTranslation('admin');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useStoreDispatch();
  const data = useSelector(selectClass());
  const [userPosted, setUserPosted] = useState(false);
  const [errors, setErrors] = useState<ClassFormErrors>(
    validateClassForm(data)
  );
  const [putClass, putClassResult] = usePutClassMutation();

  const handleUpdate = (value: ClassFormType) => {
    if (
      userPosted &&
      Object.values(errors).filter((val) => val === true).length > 0
    ) {
      setErrors(validateClassForm(value));
    }
    dispatch(setClass(value));
  };

  const handleSubmit = () => {
    if (!userPosted) {
      setUserPosted(true);
    }

    const errors = validateClassForm(data);
    setErrors(errors);

    if (Object.values(errors).filter((val) => val === true).length > 0) {
      return;
    }

    putClass({
      modelId: modelId,
      data: data,
      classId: isEdit ? data.identifier : undefined,
    });
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

  const handleTargetClassUpdate = (value?: InternalClass | undefined) => {
    if (!value) {
      return;
    }

    const classInfo = {
      id: value.id,
      label:
        value.id.split('/').pop()?.replace('#', ':') ??
        `${value.isDefinedBy.split('/').pop()}:${value.identifier}`,
    };

    handleUpdate({ ...data, targetClass: classInfo });
  };

  const handleSubClassOfRemoval = (id: string) => {
    const newSubClasses = data.subClassOf.filter(
      (subclass) => subclass.identifier !== id
    );

    if (newSubClasses.length < 1) {
      handleUpdate({
        ...data,
        subClassOf: [
          {
            attributes: [],
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
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (
      ref.current &&
      (Object.values(errors).filter((val) => val).length > 0 ||
        putClassResult.isError)
    ) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, errors, putClassResult]);

  useEffect(() => {
    if (putClassResult.isSuccess) {
      handleFollowUp(data.identifier);
    }

    if (
      putClassResult.isError &&
      putClassResult.error &&
      'data' in putClassResult.error
    ) {
      const backendErrorFields = Array.isArray(
        (putClassResult.error as AxiosQueryErrorFields).data?.details
      )
        ? (putClassResult.error as AxiosQueryErrorFields).data.details.map(
            (d) => d.field
          )
        : [];

      if (backendErrorFields.length > 0) {
        setErrors({
          identifier: backendErrorFields.includes('identifier'),
          label: backendErrorFields.includes('label'),
        });
        return;
      }

      if (putClassResult.error?.status === 401) {
        setErrors({
          ...validateClassForm(data),
          unauthorized: true,
        });
      }
    }
  }, [putClassResult, data, handleFollowUp]);

  console.log('data', data);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Button
            icon="arrowLeft"
            variant="secondaryNoBorder"
            onClick={() => handleReturn()}
            style={{ textTransform: 'uppercase' }}
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
            <Button onClick={() => handleSubmit()}>{t('save')}</Button>
            <Button variant="secondary" onClick={() => handleReturn()}>
              {t('cancel-variant')}
            </Button>
          </div>
        </div>

        {userPosted &&
        (Object.values(errors).filter((e) => e).length > 0 ||
          putClassResult.isError) ? (
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
            />
          ))}
        </LanguageVersionedWrapper>

        <TextInput
          labelText={t('class-identifier')}
          visualPlaceholder={t('input-class-identifier')}
          defaultValue={data.identifier}
          status={userPosted && errors.identifier ? 'error' : 'default'}
          disabled={isEdit}
          onChange={(e) =>
            handleUpdate({ ...data, identifier: e?.toString() ?? '' })
          }
          tooltipComponent={
            <Tooltip
              ariaToggleButtonLabelText={''}
              ariaCloseButtonLabelText={''}
            >
              <Text>Tooltip sisältö</Text>
            </Tooltip>
          }
        />

        <InlineListBlock
          addNewComponent={
            <Button variant="secondary" icon="plus">
              {t('add-upper-class')}
            </Button>
          }
          items={
            data.subClassOf.length > 0
              ? data.subClassOf.map((s) => ({
                  label: s.label,
                  id: s.identifier,
                }))
              : []
          }
          label={t('upper-classes')}
          handleRemoval={(id: string) => handleSubClassOfRemoval(id)}
          deleteDisabled={['owl:Thing']}
        />

        {applicationProfile ? (
          <InlineListBlock
            addNewComponent={
              <ClassModal
                modelId={modelId}
                mode={'select'}
                modalButtonLabel={t('select-class')}
                handleFollowUp={handleTargetClassUpdate}
                applicationProfile
              />
            }
            items={data.targetClass ? [data.targetClass] : []}
            label={t('target-class-profile')}
            handleRemoval={() =>
              handleUpdate({ ...data, targetClass: undefined })
            }
          />
        ) : (
          <InlineListBlock
            addNewComponent={
              <Button variant="secondary" icon="plus">
                {t('add-corresponding-class')}
              </Button>
            }
            items={[]}
            label={t('corresponding-classes')}
            handleRemoval={() => null}
          />
        )}

        <InlineListBlock
          label={t('separate-classes', { ns: 'common' })}
          addNewComponent={
            <Button variant="secondary" icon="plus">
              {t('add-separate-class')}
            </Button>
          }
          items={[]}
          handleRemoval={() => null}
        />

        <div>
          <Dropdown
            labelText={t('status')}
            defaultValue={data.status}
            onChange={(e) => handleUpdate({ ...data, status: e as Status })}
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
            />
          ))}
        </LanguageVersionedWrapper>

        <Separator />

        <BasicBlock title={t('attributes')}>
          {!isEdit || !data.attribute || data.attribute.length < 1 ? (
            t('no-attributes', { ns: 'common' })
          ) : (
            <ExpanderGroup
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              {data.attribute.map((attr) => (
                <ResourceInfo
                  key={`${data.identifier}-attr-${attr.identifier}`}
                  data={attr}
                  modelId={modelId}
                />
              ))}
            </ExpanderGroup>
          )}
        </BasicBlock>

        <BasicBlock title={t('associations')}>
          {!isEdit || !data.association || data.association.length < 1 ? (
            t('no-assocations', { ns: 'common' })
          ) : (
            <ExpanderGroup
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              {data.association.map((assoc) => (
                <ResourceInfo
                  key={`${data.identifier}-attr-${assoc.identifier}`}
                  data={assoc}
                  modelId={modelId}
                />
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
        />
      </DrawerContent>
    </>
  );

  function getErrors(): string[] {
    const translatedErrors = Object.entries(errors)
      .filter((e) => e[1])
      .map((e) => translateClassFormErrors(e[0], t));

    if (putClassResult.error) {
      const error = putClassResult.error as AxiosBaseQueryError;
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
