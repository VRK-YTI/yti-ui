import { useState } from 'react';
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

export default function ClassView() {
  const [view, setView] = useState<'listing' | 'class' | 'form'>('listing');

  const handleFollowUpAction = (value: any) => {
    setView('form');
  };

  const handleFormReturn = () => {
    setView('listing');
  };

  const handleFormSubmit = () => {
    setView('class');
  };

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
          <Text variant="bold">0 luokkaa</Text>
          <ClassModal handleFollowUp={handleFollowUpAction} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <FullwidthSearchInput
            labelText=""
            clearButtonLabel=""
            searchButtonLabel=""
          />
          <Text>Tietomallissa ei ole vielä yhtään luokkaa.</Text>
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
      />
    );
  }

  function renderClass() {
    if (view !== 'class') {
      return <></>;
    }

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
          <Text variant="bold">Luokan nimi</Text>
          <StatusChip>Luonnos</StatusChip>
        </div>

        <BasicBlock title="Luokan tunnus">
          ns:Luokan-tunnus
          <Button
            icon="copy"
            variant="secondary"
            style={{ width: 'min-content', whiteSpace: 'nowrap' }}
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
          <Link href="" style={{ fontSize: '16px' }}>
            ns:Aikaväli
          </Link>
        </BasicBlock>

        <BasicBlock title="Vastaavat luokat">Ei vastaavia luokkia</BasicBlock>

        <BasicBlock title="Lisätiedot">Ei huomautusta</BasicBlock>

        <div style={{ marginTop: '20px' }}>
          <Label style={{ marginBottom: '10px' }}>Attribuutit 7kpl</Label>
          <ExpanderGroup
            closeAllText=""
            openAllText=""
            showToggleAllButton={false}
          >
            <Expander>
              <ExpanderTitleButton>Alkamisaika</ExpanderTitleButton>
            </Expander>
            <Expander>
              <ExpanderTitleButton>Päättymisaika</ExpanderTitleButton>
            </Expander>
            <Expander>
              <ExpanderTitleButton>Alkamispäivämäärä</ExpanderTitleButton>
            </Expander>
            <Expander>
              <ExpanderTitleButton>Päättymispäivämäärä</ExpanderTitleButton>
            </Expander>
            <Expander>
              <ExpanderTitleButton>Alkamishetki</ExpanderTitleButton>
            </Expander>
            <Expander>
              <ExpanderTitleButton>Päättymishetki</ExpanderTitleButton>
            </Expander>
            <Expander>
              <ExpanderTitleButton>Kesto</ExpanderTitleButton>
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
            Loin uuden aliluokan
          </BasicBlock>
        </div>
      </div>
    );
  }
}
