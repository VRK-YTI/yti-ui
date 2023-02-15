import {
  Button,
  Dropdown,
  DropdownItem,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  Heading,
  InlineAlert,
  Label,
  SingleSelect,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import InlineList from '@app/common/components/inline-list';
import { useState } from 'react';
import { ClassFormWrapper } from './class-form.styles';
import AttributeModal from '../attribute-modal';
import ClassModal from '../class-modal';

export interface ClassFormProps {
  handleReturn: (value?: any) => void;
}

export default function ClassForm({ handleReturn }: ClassFormProps) {
  const languages = [
    { labelText: 'Suomi (fi)', uniqueItemId: 'fi' },
    { labelText: 'Ruotsi (sv)', uniqueItemId: 'sv' },
    { labelText: 'Englanti (en)', uniqueItemId: 'en' },
  ];
  const [upperClasses, setUpperClasses] = useState([
    {
      id: '1',
      label: 'ns:Luokka',
    },
    {
      id: '2',
      label: 'jhs:Aikaväli',
    },
  ]);

  const handleUpperClassRemoval = (id: string) => {
    setUpperClasses(upperClasses.filter((uc) => uc.id !== id));
  };

  return (
    <ClassFormWrapper>
      <div>
        <Button
          icon="arrowLeft"
          variant="secondaryNoBorder"
          onClick={() => handleReturn()}
        >
          TAKAISIN
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text variant="bold">Luokan nimi</Text>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button>Tallenna</Button>
          <Button variant="secondary">Peruuta</Button>
        </div>
      </div>

      <div>
        <Dropdown labelText="Sisällön kieli" defaultValue={'fi'}>
          {languages.map((l) => (
            <DropdownItem key={l.uniqueItemId} value={l.uniqueItemId}>
              {l.labelText}
            </DropdownItem>
          ))}
        </Dropdown>
      </div>

      {/* TODO: Move to own component */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-start',
        }}
      >
        <Label>Käsite</Label>
        <InlineAlert status="warning">Käsitettä ei ole määritelty</InlineAlert>
        <Button variant="secondary">Valitse käsite</Button>
      </div>

      <TextInput
        labelText="Luokan nimi"
        visualPlaceholder="Kirjoita luokan nimi"
      />

      <TextInput
        labelText="Luokan tunnus"
        visualPlaceholder="Kirjoita luokan tunnus"
        tooltipComponent={
          <Tooltip ariaToggleButtonLabelText={''} ariaCloseButtonLabelText={''}>
            <Text>Tooltip sisältö</Text>
          </Tooltip>
        }
      />

      <div className="spread-content">
        <Label>Yläluokat</Label>
        <InlineList
          items={upperClasses}
          handleRemoval={handleUpperClassRemoval}
        />
        <Button variant="secondary">Lisää yläluokka</Button>
      </div>

      <div className="spread-content">
        <Label>Vastaavat luokat</Label>
        <Button variant="secondary">Lisää vastaava luokka</Button>
      </div>

      <div>
        <Dropdown labelText="Tila" defaultValue="DRAFT">
          <DropdownItem value="DRAFT">Luonnos</DropdownItem>
        </Dropdown>
      </div>

      <Textarea labelText="Lisätiedot" optionalText="valinnainen" />

      <Separator />

      <div>
        <Heading variant="h3">Attribuutit</Heading>
      </div>

      <div className="spread-content">
        <Label>Luokkaan lisätyt attribuutit 0kpl</Label>
        <AttributeModal />
      </div>

      <div className="spread-content">
        <Label>Yläluokilta perityt attribuutit 6kpl</Label>
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
        </ExpanderGroup>
      </div>

      <div>
        <Heading variant="h3">Assosiaatiot</Heading>
      </div>

      <div className="spread-content">
        <Label>Luokkaan lisätyt assosiaatiot 0kpl</Label>
        <Button variant="secondary">Lisää assosiaatio</Button>
      </div>

      <div className="spread-content">
        <Label>Yläluokilta perityt assosiaatiot 0kpl</Label>
        <Text smallScreen>Ei perittyjä assosiaatiota.</Text>
      </div>

      <Separator />

      <Textarea labelText="Muokkaajan kommentti" optionalText="valinnainen" />
    </ClassFormWrapper>
  );
}
