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
import ListBlock from '../list-block';
import { ConceptTermType } from '../new-concept.types';
import {
  CheckboxBlock,
  DropdownBlock,
  GrammaticalBlock,
  MediumHeading,
  RadioButtonGroupSpaced,
  TermEquivalencyBlock,
  WiderTextareaBlock,
} from './concept-terms-block.styles';
import { TermFormUpdate } from './term-form';

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

  const handleUpdate = ({ key, value }: TermFormUpdate) => {
    let updatedTerm = termData;
    updatedTerm = { ...updatedTerm, [key]: value };

    if (
      Object.keys(invalidData).includes(key) &&
      invalidData[key as keyof typeof invalidData]
    ) {
      setInvalidData(validateFormData(updatedTerm));
    }

    setTermData(updatedTerm);
  };

  const handleSetIsHomographic = () => {
    if (isHomographic) {
      handleUpdate({ key: 'termHomographNumber', value: '' });
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
        <ModalTitle>{t('new-term')}</ModalTitle>

        <TextInput
          labelText={t('term-name-label')}
          defaultValue={termData.prefLabel}
          onBlur={(e) =>
            handleUpdate({ key: 'prefLabel', value: e.target.value })
          }
          status={invalidData.prefLabel ? 'error' : undefined}
        />

        <CheckboxBlock onClick={() => handleSetIsHomographic()}>
          {t('term-is-homograph-label')}
        </CheckboxBlock>

        {isHomographic && (
          <TextInput
            labelText={t('homograph-number')}
            type="number"
            defaultValue={termData.termHomographNumber}
            onBlur={(e) =>
              handleUpdate({
                key: 'termHomographNumber',
                value: e.target.value,
              })
            }
          />
        )}

        <RadioButtonGroupSpaced
          labelText={t('term-type')}
          name="term-type-radio-button-group"
          onChange={(e) => handleUpdate({ key: 'termType', value: e })}
          groupHintText={
            invalidData.termType ? t('term-type-error-msg') : undefined
          }
          $isInvalid={invalidData.termType}
        >
          <RadioButton value="synonym" hintText={t('synonym-description')}>
            {t('synonym')}
          </RadioButton>
          <RadioButton
            value="not-recommended-synonym"
            hintText={t('not-recommended-term-description')}
          >
            {t('not-recommended-synonym')}
          </RadioButton>
          <RadioButton
            value="search-term"
            hintText={t('search-term-description')}
          >
            {t('search-term')}
          </RadioButton>
        </RadioButtonGroupSpaced>

        <SingleSelect
          ariaOptionsAvailableText={t('available-languages')}
          clearButtonLabel=""
          items={languages.map((language) => ({
            labelText: `${t(language)} ${language.toUpperCase()}`,
            uniqueItemId: language,
          }))}
          labelText={t('language')}
          noItemsText={t('no-languages-available')}
          onItemSelectionChange={(e) =>
            handleUpdate({ key: 'language', value: e?.uniqueItemId || '' })
          }
          status={invalidData.language ? 'error' : undefined}
        />

        <DropdownBlock
          labelText={t('term-status-label')}
          defaultValue={termData.status}
          onChange={(e) => handleUpdate({ key: 'status', value: e })}
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
          onChange={(e) =>
            handleUpdate({ key: 'termInfo', value: e.target.value })
          }
        />

        <WiderTextareaBlock
          labelText={t('term-scope-label')}
          optionalText={t('optional')}
          hintText={t('term-scope-hint-text')}
          visualPlaceholder={t('term-scope-placeholder')}
          onChange={(e) =>
            handleUpdate({ key: 'scope', value: e.target.value })
          }
        />

        <TermEquivalencyBlock>
          <label>
            {t('term-equivalency')}
            <span> ({t('optional')})</span>
          </label>
          <span>{t('term-equivalency-description')}</span>
          <Dropdown
            labelText=""
            defaultValue="undefined"
            onChange={(e) => handleUpdate({ key: 'termEquivalency', value: e })}
          >
            <DropdownItem value="undefined">{t('no-selection')}</DropdownItem>
            <DropdownItem value="<">{'<'}</DropdownItem>
            <DropdownItem value=">">{'>'}</DropdownItem>
            <DropdownItem value="~">{t('almost-the-same-as')} (~)</DropdownItem>
          </Dropdown>
        </TermEquivalencyBlock>

        <WiderTextareaBlock
          labelText={t('term-sources-label')}
          optionalText={t('optional')}
          hintText={t('term-sources-hint-text')}
          visualPlaceholder={t('term-sources-placeholder')}
          onChange={(e) =>
            handleUpdate({ key: 'source', value: e.target.value })
          }
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
          onChange={(e) =>
            handleUpdate({ key: 'changeNote', value: e.target.value })
          }
        />
        <WiderTextareaBlock
          labelText={t('term-history-note-label')}
          optionalText={t('optional')}
          hintText={t('term-history-note-hint-text')}
          visualPlaceholder={t('term-history-note-placeholer')}
          onChange={(e) =>
            handleUpdate({ key: 'historyNote', value: e.target.value })
          }
        />

        <ListBlock
          update={handleUpdate}
          items={termData.editorialNote}
          itemsKey={'editorialNote'}
          noLangOption
        />

        <Separator isLarge />

        <MediumHeading variant="h2">
          {t('additional-grammatical-information')}
        </MediumHeading>

        <GrammaticalBlock>
          <SingleSelect
            ariaOptionsAvailableText={t('available-term-styles')}
            clearButtonLabel={t('clear-button-label')}
            labelText={t('term-style')}
            optionalText={t('optional')}
            noItemsText={t('no-term-styles-available')}
            visualPlaceholder={t('choose-term-style')}
            items={[
              { labelText: t('spoken-form'), uniqueItemId: 'spoken-form' },
            ]}
            onItemSelectionChange={(e) =>
              handleUpdate({ key: 'termStyle', value: e?.uniqueItemId || '' })
            }
          />

          <SingleSelect
            ariaOptionsAvailableText={t('available-term-familes')}
            clearButtonLabel={t('clear-button-label')}
            labelText={t('term-family')}
            optionalText={t('optional')}
            noItemsText={t('no-term-families-available')}
            visualPlaceholder={t('choose-term-family')}
            items={[
              {
                labelText: t('masculine'),
                uniqueItemId: 'masculine',
              },
              {
                labelText: t('neutral'),
                uniqueItemId: 'neutral',
              },
              {
                labelText: t('feminine'),
                uniqueItemId: 'feminine',
              },
            ]}
            onItemSelectionChange={(e) =>
              handleUpdate({ key: 'termFamily', value: e?.uniqueItemId || '' })
            }
          />

          <SingleSelect
            ariaOptionsAvailableText={t('available-term-conjugations')}
            clearButtonLabel={t('clear-button-label')}
            labelText={t('choose-term-conjugation')}
            optionalText={t('optional')}
            noItemsText={t('no-term-conjugations-available')}
            visualPlaceholder={t('choose-term-conjugation')}
            items={[
              { labelText: t('singular'), uniqueItemId: 'singular' },
              { labelText: t('plural'), uniqueItemId: 'plural' },
            ]}
            onItemSelectionChange={(e) =>
              handleUpdate({
                key: 'termConjugation',
                value: e?.uniqueItemId || '',
              })
            }
          />

          <Dropdown
            labelText={t('term-equivalency')}
            optionalText={t('optional')}
            defaultValue="undefined"
            onChange={(e) => handleUpdate({ key: 'termEquivalency', value: e })}
          >
            <DropdownItem value="undefined">{t('no-selection')}</DropdownItem>
            <DropdownItem value="<">{'<'}</DropdownItem>
            <DropdownItem value=">">{'>'}</DropdownItem>
            <DropdownItem value="~">{t('almost-the-same-as')} (~)</DropdownItem>
          </Dropdown>

          <SingleSelect
            ariaOptionsAvailableText={t('available-term-word-classes')}
            clearButtonLabel={t('clear-button-label')}
            labelText={t('term-word-class')}
            optionalText={t('optional')}
            noItemsText={t('no-term-word-classes-available')}
            hintText={t('term-word-class-hint-text')}
            visualPlaceholder={t('choose-term-word-class')}
            items={[{ labelText: t('adjective'), uniqueItemId: 'adjective' }]}
            onItemSelectionChange={(e) =>
              handleUpdate({ key: 'wordClass', value: e?.uniqueItemId || '' })
            }
          />
        </GrammaticalBlock>
      </ModalContent>

      <ModalFooter>
        <Button onClick={() => handleClick()}>{t('accept')}</Button>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          {t('cancel-variant')}
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
