import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  RadioButton,
  SingleSelect,
  TextInput,
} from 'suomifi-ui-components';
import { v4 } from 'uuid';
import { ConceptTermType, ItemType } from './concept-term-block-types';
import ListBlock from '../list-block';
import {
  CheckboxBlock,
  DropdownBlock,
  GrammaticalBlock,
  MediumHeading,
  RadioButtonGroupSpaced,
  TermEquivalencyBlock,
  WiderTextareaBlock,
} from './concept-terms-block.styles';

interface NewTermModalProps {
  setVisible: (value: boolean) => void;
  languages: string[];
  appendTerm: (value: ConceptTermType) => void;
}

export default function NewTermModal({
  setVisible,
  languages,
  appendTerm,
}: NewTermModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [invalidData, setInvalidData] = useState({
    prefLabel: false,
    termType: false,
    language: false,
  });
  const [isHomographic, setIsHomographic] = useState(false);
  const [termData, setTermData] = useState<ConceptTermType>({
    changeNote: '',
    draftComment: '',
    editorialNote: [],
    historyNote: '',
    id: v4(),
    language: '',
    prefLabel: '',
    scope: '',
    source: '',
    status: 'draft',
    termConjugation: '',
    termEquivalency: '',
    termEquivalencyRelation: '',
    termFamily: '',
    termHomographNumber: '',
    termInfo: '',
    termStyle: '',
    termType: '',
    wordClass: '',
  });

  const handleUpdate = (
    key: string,
    value?: string | ItemType[] | null
  ) => {
    let updatedTerm = termData;
    updatedTerm = { ...updatedTerm, [key]: value };

    if (['prefLabel', 'termType', 'language'].includes(key)) {
      setInvalidData(validateFormData(updatedTerm));
    }

    setTermData(updatedTerm);
  };

  const handleSetIsHomographic = () => {
    if (isHomographic) {
      handleUpdate('termHomographNumber', '');
    }
    setIsHomographic(!isHomographic);
  };

  const handleClick = () => {
    const invalidKeys = validateFormData(termData);
    setInvalidData(invalidKeys);

    if (
      Object.keys(invalidKeys).filter(
        (key) => invalidKeys[key as keyof typeof invalidKeys]
      ).length > 0
    ) {
      return;
    }

    appendTerm(termData);
    setVisible(false);
  };

  return (
    <Modal
      appElementId="__next"
      onEscKeyDown={() => setVisible(false)}
      visible={true}
      variant={!isSmall ? 'default' : 'smallScreen'}
    >
      <ModalContent>
        <ModalTitle>Uusi termi</ModalTitle>

        <TextInput
          labelText={t('term-name-label')}
          defaultValue={termData.prefLabel}
          onBlur={(e) => handleUpdate('prefLabel', e.target.value)}
          status={invalidData.prefLabel ? 'error' : undefined}
        />

        <CheckboxBlock onClick={() => handleSetIsHomographic()}>
          {t('term-is-homograph-label')}
        </CheckboxBlock>

        {isHomographic && (
          <TextInput
            labelText="Homonyymin järjestysnumero"
            type="number"
            defaultValue={termData.termHomographNumber}
            onBlur={(e) => handleUpdate('termHomographNumber', e.target.value)}
          />
        )}

        <RadioButtonGroupSpaced
          labelText="Termin typppi"
          name="term-type-radio-button-group"
          onChange={(e) => handleUpdate('termType', e)}
          groupHintText={
            invalidData.termType
              ? 'Termin tyyppi pitää olla valittu'
              : undefined
          }
          $isInvalid={invalidData.termType}
        >
          <RadioButton
            value="synonym"
            hintText="Termi, jolla on lähes sama merkitys kuin suositettavalla termillä"
          >
            Synonyymi
          </RadioButton>
          <RadioButton
            value="not-recommended-synonym"
            hintText="Termi, joka ei kuvaa kielellisesti hyvin käsitettä"
          >
            Ei suositettava synonyymi
          </RadioButton>
          <RadioButton
            value="search-term"
            hintText="Termi, jolla käsitteen voi löytää palvelusta"
          >
            Hakutermi
          </RadioButton>
        </RadioButtonGroupSpaced>

        <SingleSelect
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          items={languages.map((language) => ({
            labelText: language,
            uniqueItemId: language,
          }))}
          labelText="Kieli"
          noItemsText=""
          onItemSelectionChange={(e) =>
            handleUpdate('language', e?.labelText || '')
          }
          status={invalidData.language ? 'error' : undefined}
        />

        <DropdownBlock
          labelText={t('term-status-label')}
          defaultValue={termData.status}
          onChange={(e) => handleUpdate('status', e)}
        >
          <DropdownItem value="draft">
            {t('DRAFT', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="incomplete">
            {t('INCOMPLETE', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="valid">
            {t('VALID', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="superseded">
            {t('SUPERSEDED', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="retired">
            {t('RETIRED', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="invalid">
            {t('INVALID', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="suggested">
            {t('SUGGESTED', { ns: 'common' })}
          </DropdownItem>
        </DropdownBlock>

        <WiderTextareaBlock
          labelText={t('term-info-label')}
          optionalText={t('optional')}
          visualPlaceholder={t('term-info-placeholder')}
          onChange={(e) => handleUpdate('termInfo', e.target.value)}
        />

        <WiderTextareaBlock
          labelText={t('term-scope-label')}
          optionalText={t('optional')}
          hintText={t('term-scope-hint-text')}
          visualPlaceholder={t('term-scope-placeholder')}
          onChange={(e) => handleUpdate('scope', e.target.value)}
        />

        <TermEquivalencyBlock>
          <label>
            Termin vastaavuus
            <span> ({t('optional')})</span>
          </label>
          <span>
            Termin vastaavuus liittyy saman kieliversion suositettavaan termiin
          </span>
          <Dropdown
            labelText=""
            defaultValue="undefined"
            onChange={(e) => handleUpdate('termEquivalency', e)}
          >
            <DropdownItem value="undefined">Ei valintaa</DropdownItem>
            <DropdownItem value="<">{'<'}</DropdownItem>
            <DropdownItem value=">">{'>'}</DropdownItem>
            <DropdownItem value="~">Lähes sama kuin (~)</DropdownItem>
          </Dropdown>
        </TermEquivalencyBlock>

        <WiderTextareaBlock
          labelText={t('term-sources-label')}
          optionalText={t('optional')}
          hintText={t('term-sources-hint-text')}
          visualPlaceholder={t('term-sources-placeholder')}
          onChange={(e) => handleUpdate('source', e.target.value)}
        />

        <Separator isLarge />

        <MediumHeading variant="h2">
          {t('administrative-details')}
        </MediumHeading>

        <WiderTextareaBlock
          labelText={t('term-change-note-label')}
          optionalText={t('optional')}
          hintText={t('term-change-note-hint-text')}
          visualPlaceholder={t('term-change-note-placeholder')}
          onChange={(e) => handleUpdate('changeNote', e.target.value)}
        />
        <WiderTextareaBlock
          labelText={t('term-history-note-label')}
          optionalText={t('optional')}
          hintText={t('term-history-note-hint-text')}
          visualPlaceholder={t('term-history-note-placeholer')}
          onChange={(e) => handleUpdate('historyNote', e.target.value)}
        />

        <ListBlock
          update={handleUpdate}
          items={termData.editorialNote}
          itemsKey={'editorialNote'}
          noLangOption
        />

        <Separator isLarge />

        <MediumHeading variant="h2">Kieliopilliset lisätiedot</MediumHeading>

        <GrammaticalBlock>
          <SingleSelect
            ariaOptionsAvailableText=""
            clearButtonLabel=""
            labelText="Termin tyyli"
            optionalText="valinnainen"
            noItemsText=""
            visualPlaceholder="Valitse termin tyyli"
            items={[{ labelText: 'puhekieli', uniqueItemId: 'spoken-form' }]}
            onItemSelectionChange={(e) =>
              handleUpdate('termStyle', e?.labelText || '')
            }
          />

          <SingleSelect
            ariaOptionsAvailableText=""
            clearButtonLabel=""
            labelText="Termin suku"
            optionalText="valinnainen"
            noItemsText=""
            visualPlaceholder="Valitse termin suku"
            items={[
              {
                labelText: 'maskuliini',
                uniqueItemId: 'masculine',
              },
              {
                labelText: 'neutri',
                uniqueItemId: 'neutral',
              },
              {
                labelText: 'feminiini',
                uniqueItemId: 'feminine',
              },
            ]}
            onItemSelectionChange={(e) =>
              handleUpdate('termFamily', e?.labelText || '')
            }
          />

          <SingleSelect
            ariaOptionsAvailableText=""
            clearButtonLabel=""
            labelText="Termin luku"
            optionalText="valinnainen"
            noItemsText=""
            visualPlaceholder="Valitse termin luku"
            items={[
              { labelText: 'yksikkö', uniqueItemId: 'singular' },
              { labelText: 'monikko', uniqueItemId: 'plural' },
            ]}
            onItemSelectionChange={(e) =>
              handleUpdate('termConjugation', e?.labelText || '')
            }
          />

          <Dropdown
            labelText="Termin vastaavuus"
            optionalText={t('optional')}
            defaultValue="undefined"
            onChange={(e) => handleUpdate('termEquivalency', e)}
          >
            <DropdownItem value="undefined">Ei valintaa</DropdownItem>
            <DropdownItem value="<">{'<'}</DropdownItem>
            <DropdownItem value=">">{'>'}</DropdownItem>
            <DropdownItem value="~">Lähes sama kuin (~)</DropdownItem>
          </Dropdown>

          <SingleSelect
            ariaOptionsAvailableText=""
            clearButtonLabel=""
            labelText="Termin sanaluokka"
            optionalText="valinnainen"
            noItemsText=""
            hintText="Merkitään jos termi on eri sanaluokasta kuin muunkieliset termit."
            visualPlaceholder="Valitse sanaluokka"
            items={[{ labelText: 'test1', uniqueItemId: 'test1' }]}
            onItemSelectionChange={(e) =>
              handleUpdate('wordClass', e?.labelText || '')
            }
          />
        </GrammaticalBlock>
      </ModalContent>

      <ModalFooter>
        <Button onClick={() => handleClick()}>Hyväksy</Button>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          Peruuta
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function validateFormData(data: ConceptTermType) {
  const invalidData = {
    prefLabel: false,
    termType: false,
    language: false,
  };

  if (!data.prefLabel || data.prefLabel === '') {
    invalidData.prefLabel = true;
  }

  if (!data.termType || data.termType === '') {
    invalidData.termType = true;
  }

  if (!data.language || data.language === '') {
    invalidData.language = true;
  }

  return invalidData;
}
