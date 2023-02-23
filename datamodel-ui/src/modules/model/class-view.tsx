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
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  HintText,
  Label,
  Link,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import { StatusChip } from 'yti-common-ui/multi-column-search/multi-column-search.styles';
import Separator from 'yti-common-ui/separator';
import ClassForm from '../class-form';
import ClassModal from '../class-modal';
import { FullwidthSearchInput } from './model.styles';
import {
  classFormToClass,
  internalClassToClassForm,
  validateClassForm,
} from './utils';

interface ClassView {
  modelId: string;
}

export default function ClassView({ modelId }: ClassView) {
  const { i18n } = useTranslation('common');
  const { data: modelInfo } = useGetModelQuery(modelId);
  const [formData, setFormData] = useState<ClassFormType>(initialClassForm);
  const [view, setView] = useState<'listing' | 'class' | 'form'>('listing');
  const [putClass, putClassResult] = usePutClassMutation();
  const [getClass, getClassResult] = useGetClassMutMutation();

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
        fi: 'aaa111',
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
      setFormData(initialClassForm);
      return;
    }

    setFormData(internalClassToClassForm(value, languages));
  };

  const handleFormReturn = () => {
    setView('listing');
  };

  const handleFormSubmit = () => {
    const errors = validateClassForm(formData);
    const data = classFormToClass(formData);

    putClass({ modelId: modelId, data: data });
  };

  const handleListItemClick = (value: ClassFormType) => {
    setView('class');
    setFormData(value);
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

  return (
    <div>
      {renderListing()}
      {renderClass()}
      {renderForm()}
    </div>
  );

  function renderListing() {
    if (view !== 'listing') {
      return <></>;
    }

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Text variant="bold">{mockClassList.length} luokkaa</Text>
          <ClassModal handleFollowUp={handleFollowUpAction} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <FullwidthSearchInput
            labelText=""
            clearButtonLabel=""
            searchButtonLabel=""
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
        </div>
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
        setData={setFormData}
        languages={languages}
      />
    );
  }

  function renderClass() {
    if (view !== 'class' || !getClassResult.isSuccess) {
      return <></>;
    }

    const data = getClassResult.data;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Button
            variant="secondaryNoBorder"
            icon="arrowLeft"
            onClick={() => setView('listing')}
          >
            TAKAISIN
          </Button>
          <Button variant="secondary" iconRight="menu">
            Toiminnot
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Text variant="bold">
            {getLanguageVersion({ data: data.label, lang: i18n.language })}
          </Text>
          <StatusChip $isValid={formData.status === 'VALID'}>
            {data.status}
          </StatusChip>
        </div>

        <BasicBlock title="Luokan tunnus">
          {data.identifier}
          <Button
            icon="copy"
            variant="secondary"
            style={{ width: 'min-content', whiteSpace: 'nowrap' }}
            onClick={() => navigator.clipboard.writeText(data.identifier)}
          >
            Kopioi leikepöydälle
          </Button>
        </BasicBlock>

        <div style={{ marginTop: '20px' }}>
          <Expander>
            <ExpanderTitleButton>
              Käsitteen määritelmä
              <HintText>Aikaväli</HintText>
            </ExpanderTitleButton>
          </Expander>
        </div>

        <BasicBlock title="Yläluokka">
          {data.subClassOf.map((c) => (
            <Link key={c} href="" style={{ fontSize: '16px' }}>
              {c.split('/').pop()?.replace('#', ':')}
            </Link>
          ))}
        </BasicBlock>

        <BasicBlock title="Vastaavat luokat">Ei vastaavia luokkia</BasicBlock>

        <BasicBlock title="Lisätiedot">
          {data.comment ?? 'Ei huomautusta'}
        </BasicBlock>

        <div style={{ marginTop: '20px' }}>
          <Label style={{ marginBottom: '10px' }}>Attribuutit 2kpl</Label>
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

        <BasicBlock title="Assosiaatiot 0kpl">Ei assosiaatioita</BasicBlock>

        <BasicBlock title="Viittaukset muista komponenteista">
          Ei viittauksia
        </BasicBlock>

        <Separator />

        <div>
          <BasicBlock title="Luotu">Päiväys</BasicBlock>

          <BasicBlock title="Muokkaajan kommentti">
            {getLanguageVersion({ data: data.note, lang: i18n.language })}
          </BasicBlock>
        </div>
      </div>
    );
  }
}
