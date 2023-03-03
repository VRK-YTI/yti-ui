import {
  Button,
  Dropdown,
  DropdownItem,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  Heading,
  Label,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import InlineList from '@app/common/components/inline-list';
import {
  ClassFormWrapper,
  LanguageVersionedWrapper,
} from './class-form.styles';
import AttributeModal from '../attribute-modal';
import { useTranslation } from 'next-i18next';
import { Status } from '@app/common/interfaces/status.interface';
import ConceptBlock from './concept-block';
import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { ClassFormErrors } from '../model/utils';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import { statusList } from 'yti-common-ui/utils/status-list';
import {
  translateClassFormErrors,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { StaticHeaderWrapper } from '../model/model.styles';
import { useEffect, useRef, useState } from 'react';

export interface ClassFormProps {
  handleReturn: () => void;
  handleSubmit: () => void;
  data: ClassFormType;
  setData: (value: ClassFormType) => void;
  languages: string[];
  errors: ClassFormErrors;
  userPosted: boolean;
}

export default function ClassForm({
  handleReturn,
  handleSubmit,
  data,
  setData,
  languages,
  errors,
  userPosted,
}: ClassFormProps) {
  const { t } = useTranslation('admin');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleSubClassOfRemoval = (id: string) => {
    setData({
      ...data,
      subClassOf: data.subClassOf.filter((s) => s.identifier !== id),
    });
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (ref.current && Object.values(errors).filter((val) => val).length > 0) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, errors]);

  return (
    <>
      <StaticHeaderWrapper ref={ref}>
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
            {Object.entries(data.label).find((l) => l[1] !== '')?.[1] ??
              t('class-name')}
          </Text>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={() => handleSubmit()}>{t('save')}</Button>
            <Button variant="secondary" onClick={() => handleReturn()}>
              {t('cancel-variant')}
            </Button>
          </div>
        </div>

        {userPosted && (
          <div>
            <FormFooterAlert
              labelText={t('missing-information-title', { ns: 'admin' })}
              alerts={Object.entries(errors)
                .filter((err) => err[1])
                .map((err) => translateClassFormErrors(err[0], t))}
            />
          </div>
        )}
      </StaticHeaderWrapper>

      <ClassFormWrapper $height={headerHeight}>
        <ConceptBlock
          concept={
            data.equivalentClass.length > 0
              ? data.equivalentClass[0]
              : undefined
          }
          setConcept={(
            value: ClassFormType['equivalentClass'][0] | undefined
          ) => {
            const label = value
              ? Object.fromEntries(
                  Object.entries(data.label).map((obj) => {
                    if (value.label[obj[0]] != null) {
                      return [[obj[0]], value.label[obj[0]]];
                    }
                    return [[obj[0]], data.label[obj[0]]];
                  })
                )
              : undefined;

            setData({
              ...data,
              equivalentClass: value ? [value] : [],
              label: label ? label : data.label,
            });
          }}
        />

        <LanguageVersionedWrapper>
          {languages.map((lang) => (
            <TextInput
              key={`label-${lang}`}
              labelText={`${t('class-name')}, ${lang}`}
              value={data.label[lang] ?? ''}
              onChange={(e) =>
                setData({
                  ...data,
                  label: { ...data.label, [lang]: e?.toString() ?? '' },
                })
              }
              status={userPosted && errors.label ? 'error' : 'default'}
            />
          ))}
        </LanguageVersionedWrapper>

        <TextInput
          labelText={t('class-identifier')}
          visualPlaceholder={t('input-class-identifier')}
          defaultValue={data.identifier}
          status={userPosted && errors.identifier ? 'error' : 'default'}
          onChange={(e) =>
            setData({ ...data, identifier: e?.toString() ?? '' })
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

        <div className="spread-content">
          <Label>{t('upper-classes')}</Label>
          <InlineList
            items={
              data.subClassOf.length > 0
                ? data.subClassOf.map((s) => ({
                    label: s.label,
                    id: s.identifier,
                  }))
                : []
            }
            handleRemoval={handleSubClassOfRemoval}
          />
          <Button variant="secondary">{t('add-upper-class')}</Button>
        </div>

        <div className="spread-content">
          <Label>{t('corresponding-classes')}</Label>
          <Button variant="secondary">{t('add-corresponding-class')}</Button>
        </div>

        <div>
          <Dropdown
            labelText={t('status')}
            defaultValue={data.status}
            onChange={(e) => setData({ ...data, status: e as Status })}
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
              labelText={`${t('additional-information')}, ${lang}`}
              optionalText={t('optional')}
              defaultValue={data.note[lang as keyof typeof data.note]}
              onChange={(e) =>
                setData({
                  ...data,
                  note: { ...data.note, [lang]: e.target.value },
                })
              }
            />
          ))}
        </LanguageVersionedWrapper>

        <Separator />

        <div>
          <Heading variant="h3">{t('attributes')}</Heading>
        </div>

        <div className="spread-content">
          <Label>{t('attributes-added-to-class', { count: 0 })}</Label>
          <AttributeModal />
        </div>

        <div className="spread-content">
          <Label>
            {t('attributes-inherited-from-upper-classes', {
              count:
                data.subClassOf.length > 0
                  ? data.subClassOf[0].attributes.length
                  : 0,
            })}
          </Label>
          <ExpanderGroup
            closeAllText=""
            openAllText=""
            showToggleAllButton={false}
          >
            {data.subClassOf.length > 0 ? (
              data.subClassOf[0].attributes.map((attr) => (
                <Expander key={attr}>
                  <ExpanderTitleButton>{attr}</ExpanderTitleButton>
                </Expander>
              ))
            ) : (
              <Text smallScreen>{t('no-inherited-attributes')}</Text>
            )}
          </ExpanderGroup>
        </div>

        <div>
          <Heading variant="h3">{t('associations')}</Heading>
        </div>

        <div className="spread-content">
          <Label>{t('associations-added-to-class', { count: 0 })}</Label>
          <Button variant="secondary">{t('add-association')}</Button>
        </div>

        <div className="spread-content">
          <Label>
            {t('associations-inherited-from-upper-classes', { count: 0 })}
          </Label>
          <Text smallScreen>{t('no-inherited-associations')}</Text>
        </div>

        <Separator />

        <Textarea
          labelText={t('editor-comment')}
          optionalText={t('optional')}
          defaultValue={data.editorialNote}
          onChange={(e) => setData({ ...data, editorialNote: e.target.value })}
        />
      </ClassFormWrapper>
    </>
  );
}
