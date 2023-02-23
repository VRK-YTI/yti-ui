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

export interface ClassFormProps {
  handleReturn: () => void;
  handleSubmit: () => void;
  data: ClassFormType;
  setData: (value: ClassFormType) => void;
  languages: string[];
}

export default function ClassForm({
  handleReturn,
  handleSubmit,
  data,
  setData,
  languages,
}: ClassFormProps) {
  const { i18n } = useTranslation('admin');

  const handleSubClassOfRemoval = (id: string) => {
    setData({
      ...data,
      subClassOf: data.subClassOf.filter((s) => s.identifier !== id),
    });
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
        <Text variant="bold">
          {Object.entries(data.label).find((l) => l[1] !== '')?.[1] ??
            'Luokan nimi'}
        </Text>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => handleSubmit()}>Tallenna</Button>
          <Button variant="secondary" onClick={() => handleReturn()}>
            Peruuta
          </Button>
        </div>
      </div>

      <ConceptBlock
        concept={
          data.equivalentClass.length > 0 ? data.equivalentClass[0] : undefined
        }
        setConcept={(value: ClassFormType['equivalentClass'][0] | undefined) =>
          setData({ ...data, equivalentClass: value ? [value] : [] })
        }
      />

      <LanguageVersionedWrapper>
        {languages.map((lang) => (
          <TextInput
            key={`label-${lang}`}
            labelText={`Luokan nimi, ${lang}`}
            value={data.label[lang]}
            onChange={(e) =>
              setData({
                ...data,
                label: { ...data.label, [lang]: e?.toString() ?? '' },
              })
            }
          />
        ))}
      </LanguageVersionedWrapper>

      <TextInput
        labelText="Luokan tunnus"
        visualPlaceholder="Kirjoita luokan tunnus"
        defaultValue={data.identifier}
        onChange={(e) => setData({ ...data, identifier: e?.toString() ?? '' })}
        tooltipComponent={
          <Tooltip ariaToggleButtonLabelText={''} ariaCloseButtonLabelText={''}>
            <Text>Tooltip sisältö</Text>
          </Tooltip>
        }
      />

      <div className="spread-content">
        <Label>Yläluokat</Label>
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
        <Button variant="secondary">Lisää yläluokka</Button>
      </div>

      <div className="spread-content">
        <Label>Vastaavat luokat</Label>
        <Button variant="secondary">Lisää vastaava luokka</Button>
      </div>

      <div>
        <Dropdown
          labelText="Tila"
          defaultValue={data.status}
          onChange={(e) => setData({ ...data, status: e as Status })}
        >
          <DropdownItem value="DRAFT">Luonnos</DropdownItem>
          <DropdownItem value="VALID">Voimassa oleva</DropdownItem>
          <DropdownItem value="INCOMPLETE">Keskeneräinen</DropdownItem>
          <DropdownItem value="INVALID">Virheellinen</DropdownItem>
          <DropdownItem value="RETIRED">Poistettu käytöstä</DropdownItem>
          <DropdownItem value="SUGGESTED">Ehdotus</DropdownItem>
          <DropdownItem value="SUPERSEDED">Korvattu</DropdownItem>
        </Dropdown>
      </div>

      <LanguageVersionedWrapper>
        {languages.map((lang) => (
          <Textarea
            key={`comment-${lang}`}
            labelText={`Lisätiedot, ${lang}`}
            optionalText="valinnainen"
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
        <Heading variant="h3">Attribuutit</Heading>
      </div>

      <div className="spread-content">
        <Label>Luokkaan lisätyt attribuutit 0kpl</Label>
        <AttributeModal />
      </div>

      <div className="spread-content">
        <Label>
          Yläluokilta perityt attribuutit{' '}
          {data.subClassOf.length > 0
            ? data.subClassOf[0].attributes.length
            : 0}
          kpl
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
            <Text smallScreen>Ei perittyjä attribuutteja.</Text>
          )}
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

      <Textarea
        labelText="Muokkaajan kommentti"
        optionalText="valinnainen"
        defaultValue={data.comment}
        onChange={(e) => setData({ ...data, comment: e.target.value })}
      />
    </ClassFormWrapper>
  );
}
