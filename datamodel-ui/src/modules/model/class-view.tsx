import {
  useGetClassMutMutation,
  usePutClassMutation,
} from '@app/common/components/class/class.slice';
import { useGetModelQuery } from '@app/common/components/model/model.slice';
import {
  ClassFormType,
  initialClassForm,
} from '@app/common/interfaces/class-form.interface';
import { ClassType } from '@app/common/interfaces/class.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  HintText,
  Label,
  Link,
  Text,
  Tooltip,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import { StatusChip } from '@app/common/components/multi-column-search/multi-column-search.styles';
import Separator from 'yti-common-ui/separator';
import ClassForm from '../class-form';
import ClassModal from '../class-modal';
import {
  FullwidthSearchInput,
  ModelInfoWrapper,
  StaticHeaderWrapper,
  TooltipWrapper,
} from './model.styles';
import {
  ClassFormErrors,
  classFormToClass,
  internalClassToClassForm,
  validateClassForm,
} from './utils';

interface ClassView {
  modelId: string;
}

export default function ClassView({ modelId }: ClassView) {
  const { t, i18n } = useTranslation('common');
  const { data: modelInfo } = useGetModelQuery(modelId);
  const [formData, setFormData] = useState<ClassFormType>(initialClassForm);
  const [formErrors, setFormErrors] = useState<ClassFormErrors>(
    validateClassForm(formData)
  );
  const [userPosted, setUserPosted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [view, setView] = useState<'listing' | 'class' | 'form'>('listing');
  const [putClass, putClassResult] = usePutClassMutation();
  const [getClass, getClassResult] = useGetClassMutMutation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const languages: string[] = useMemo(() => {
    if (!modelInfo) {
      return [];
    }

    return modelInfo.languages;
  }, [modelInfo]);

  const mockClassList: ClassType[] = [
    {
      label: {
        fi: 'Uusi luokka',
        en: 'New class',
      },
      status: 'DRAFT',
      equivalentClass: [],
      subClassOf: [],
      note: {
        fi: 'Huomautus',
      },
      subject: 'http://uri.suomi.fi/terminology/demo',
      identifier: 'uusiluokka',
    },
    {
      label: {
        fi: 'Test',
      },
      status: 'DRAFT',
      equivalentClass: [],
      subClassOf: [],
      note: {
        fi: 'Lisätiedot',
      },
      subject: 'http://uri.suomi.fi/terminology/demo',
      identifier: 'aaa111',
    },
  ];

  const handleFollowUpAction = (value?: InternalClass) => {
    setView('form');

    if (!value) {
      const initialData = initialClassForm;
      const label = Object.fromEntries(languages.map((lang) => [lang, '']));
      setFormData({ ...initialData, label: label });
      return;
    }

    setFormData(internalClassToClassForm(value, languages));
  };

  const handleFormReturn = () => {
    setView('listing');
    setUserPosted(false);
    setFormData(initialClassForm);
    setFormErrors(validateClassForm(initialClassForm));
  };

  const setFormDataHandler = (value: ClassFormType) => {
    if (
      userPosted &&
      Object.values(formErrors).filter((val) => val === true).length > 0
    ) {
      setFormErrors(validateClassForm(value));
    }

    setFormData(value);
  };

  const handleFormSubmit = () => {
    if (!userPosted) {
      setUserPosted(true);
    }

    const errors = validateClassForm(formData);
    setFormErrors(errors);

    if (Object.values(errors).filter((val) => val === true).length > 0) {
      return;
    }

    const data = classFormToClass(formData);
    putClass({ modelId: modelId, data: data });
  };

  useEffect(() => {
    if (putClassResult.isSuccess) {
      getClass({ modelId: modelId, classId: formData.identifier });
    }
  }, [putClassResult, modelId, formData.identifier, getClass]);

  useEffect(() => {
    if (getClassResult.isSuccess) {
      setView('class');
    }
  }, [getClassResult]);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (ref.current && ['listing', 'class'].includes(view)) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, view]);

  return (
    <>
      {renderListing()}
      {renderClass()}
      {renderForm()}
    </>
  );

  function renderListing() {
    if (view !== 'listing') {
      return <></>;
    }

    return (
      <>
        <StaticHeaderWrapper ref={ref}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text variant="bold">
              {t('classes', { count: mockClassList.length })}
            </Text>
            <ClassModal handleFollowUp={handleFollowUpAction} />
          </div>
        </StaticHeaderWrapper>

        <ModelInfoWrapper $height={headerHeight}>
          <FullwidthSearchInput
            labelText=""
            clearButtonLabel=""
            searchButtonLabel=""
            labelMode="hidden"
          />
          {mockClassList.length < 1 ? (
            <Text>Tietomallissa ei ole vielä yhtään luokkaa.</Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {mockClassList.map((c) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  key={c.identifier}
                  onClick={() =>
                    getClass({ modelId: modelId, classId: c.identifier })
                  }
                >
                  {c.label.fi}
                </div>
              ))}
            </div>
          )}
        </ModelInfoWrapper>
      </>
    );
  }

  function renderForm() {
    if (view !== 'form') {
      return <></>;
    }

    return (
      <ClassForm
        handleReturn={handleFormReturn}
        handleSubmit={handleFormSubmit}
        data={formData}
        setData={setFormDataHandler}
        languages={languages}
        errors={formErrors}
        userPosted={userPosted}
      />
    );
  }

  function renderClass() {
    if (view !== 'class' || !getClassResult.isSuccess) {
      return <></>;
    }
    const data = getClassResult.data;

    return (
      <>
        <StaticHeaderWrapper ref={ref}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="secondaryNoBorder"
              icon="arrowLeft"
              onClick={() => setView('listing')}
              style={{ textTransform: 'uppercase' }}
            >
              {t('back')}
            </Button>
            <div>
              <Button
                variant="secondary"
                iconRight="menu"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                {t('actions')}
              </Button>
              <TooltipWrapper>
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                  open={showTooltip}
                  onCloseButtonClick={() => setShowTooltip(false)}
                >
                  <Button variant="secondaryNoBorder">
                    {t('edit', { ns: 'admin' })}
                  </Button>
                  <Separator />
                  <Button variant="secondaryNoBorder">
                    {t('show-as-file')}
                  </Button>
                  <Button variant="secondaryNoBorder">
                    {t('download-as-file')}
                  </Button>
                  <Separator />
                  <Button variant="secondaryNoBorder">
                    {t('remove', { ns: 'admin' })}
                  </Button>
                </Tooltip>
              </TooltipWrapper>
            </div>
          </div>
        </StaticHeaderWrapper>

        <ModelInfoWrapper $height={headerHeight}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Text variant="bold">
              {getLanguageVersion({ data: data.label, lang: i18n.language })}
            </Text>
            <StatusChip $isValid={formData.status === 'VALID'}>
              {data.status}
            </StatusChip>
          </div>

          <BasicBlock title={t('class-identifier')}>
            {data.identifier}
            <Button
              icon="copy"
              variant="secondary"
              style={{ width: 'min-content', whiteSpace: 'nowrap' }}
              onClick={() => navigator.clipboard.writeText(data.identifier)}
            >
              {t('copy-to-clipboard')}
            </Button>
          </BasicBlock>

          <div style={{ marginTop: '20px' }}>
            <Expander>
              <ExpanderTitleButton>
                {t('concept-definition')}
                <HintText>{t('interval')}</HintText>
              </ExpanderTitleButton>
            </Expander>
          </div>

          <BasicBlock title={t('upper-class')}>
            {data.subClassOf.map((c) => (
              <Link key={c} href="" style={{ fontSize: '16px' }}>
                {c.split('/').pop()?.replace('#', ':')}
              </Link>
            ))}
          </BasicBlock>

          <BasicBlock title={t('equivalent-classes')}>
            {t('no-equivalent-classes')}
          </BasicBlock>

          <BasicBlock title={t('additional-information')}>
            {data.editorialNote ?? t('no-comment')}
          </BasicBlock>

          <div style={{ marginTop: '20px' }}>
            <Label style={{ marginBottom: '10px' }}>
              {t('attributes', { count: 2 })}
            </Label>
            <ExpanderGroup
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              <Expander>
                <ExpanderTitleButton>Attribuutti #1</ExpanderTitleButton>
              </Expander>
              <Expander>
                <ExpanderTitleButton>Attribuutti #2</ExpanderTitleButton>
              </Expander>
            </ExpanderGroup>
          </div>

          <BasicBlock title={t('associations', { count: 0 })}>
            {t('no-assocations')}
          </BasicBlock>

          <BasicBlock title={t('references-from-other-components')}>
            {t('no-references')}
          </BasicBlock>

          <Separator />

          <div>
            <BasicBlock title={t('created')}>Päiväys</BasicBlock>

            <BasicBlock title={t('editor-comment')}>
              {getLanguageVersion({ data: data.note, lang: i18n.language })}
            </BasicBlock>
          </div>
        </ModelInfoWrapper>
      </>
    );
  }
}
