import FormFooterAlert from '@app/common/components/form-footer-alert';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import Separator from '@app/common/components/separator';
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from '@app/common/utils/constants';
import {
  translateEditConceptError,
  translateLanguage,
  translateWordClass,
} from '@app/common/utils/translation-helpers';
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
  HomographTextInput,
  LanguageSingleSelect,
  MediumHeading,
  ModalDescription,
  RadioButtonGroupSpaced,
  TermEquivalencyBlock,
  WiderTextareaBlock,
} from './concept-terms-block.styles';
import { TermFormUpdate } from './term-form';

interface NewTermModalProps {
  setVisible: (value: boolean) => void;
  languages: string[];
  appendTerm: (value: ConceptTermType) => void;
  recommendedTermLangs: string[];
}

export default function NewTermModal({
  setVisible,
  languages,
  appendTerm,
  recommendedTermLangs,
}: NewTermModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [invalidData, setInvalidData] = useState({
    prefLabel: false,
    termType: false,
    language: false,
    recommendedTermDuplicate: false,
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
    source: [],
    status: 'DRAFT',
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

  const wordClasses = [
    {
      labelText: translateWordClass('adjective', t),
      uniqueItemId: 'adjective',
    },
    {
      labelText: translateWordClass('verb', t),
      uniqueItemId: 'verb',
    },
  ];

  const handleUpdate = ({ key, value }: TermFormUpdate) => {
    let updatedTerm = termData;
    updatedTerm = {
      ...updatedTerm,
      [key]: typeof value === 'string' ? value.trim() : value,
    };

    if (
      Object.keys(invalidData).includes(key) &&
      invalidData[key as keyof typeof invalidData]
    ) {
      setInvalidData(validateFormData(updatedTerm, recommendedTermLangs));
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
    const invalidKeys = validateFormData(termData, recommendedTermLangs);
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
        <ModalDescription>{t('new-term-modal-description')}</ModalDescription>

        <TextInput
          labelText={t('term-name-label')}
          defaultValue={termData.prefLabel}
          onBlur={(e) =>
            handleUpdate({ key: 'prefLabel', value: e.target.value })
          }
          status={invalidData.prefLabel ? 'error' : undefined}
          maxLength={TEXT_INPUT_MAX}
        />

        <CheckboxBlock onClick={() => handleSetIsHomographic()}>
          {t('term-is-homograph-label')}
        </CheckboxBlock>

        {isHomographic && (
          <HomographTextInput
            labelText={t('homograph-number')}
            type="number"
            defaultValue={termData.termHomographNumber}
            onBlur={(e) =>
              handleUpdate({
                key: 'termHomographNumber',
                value: e.target.value,
              })
            }
            maxLength={TEXT_INPUT_MAX}
          />
        )}

        <LanguageSingleSelect
          ariaOptionsAvailableText={t('available-languages')}
          clearButtonLabel=""
          items={languages.map((language) => ({
            labelText: `${translateLanguage(
              language,
              t
            )} ${language.toUpperCase()}`,
            uniqueItemId: language,
          }))}
          labelText={t('language')}
          noItemsText={t('no-languages-available')}
          onItemSelectionChange={(e) =>
            handleUpdate({ key: 'language', value: e?.uniqueItemId || '' })
          }
          status={
            invalidData.language || invalidData.recommendedTermDuplicate
              ? 'error'
              : undefined
          }
        />

        <RadioButtonGroupSpaced
          labelText={t('term-type')}
          name="term-type-radio-button-group"
          onChange={(e) => handleUpdate({ key: 'termType', value: e })}
          groupHintText={
            invalidData.termType ? t('term-type-error-msg') : undefined
          }
          $isInvalid={
            invalidData.termType || invalidData.recommendedTermDuplicate
          }
        >
          <RadioButton
            value="recommended-term"
            hintText={t('recommended-term-description')}
            disabled={prefLabelInLangExists(termData, recommendedTermLangs)}
          >
            {t('recommended-term', { ns: 'common' })}
          </RadioButton>
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

        <DropdownBlock
          labelText={t('term-status-label')}
          defaultValue={termData.status}
          onChange={(e) => handleUpdate({ key: 'status', value: e })}
        >
          <DropdownItem value="DRAFT">
            {t('statuses.draft', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="INCOMPLETE">
            {t('statuses.incomplete', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="VALID">
            {t('statuses.valid', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="SUPERSEDED">
            {t('statuses.superseded', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="RETIRED">
            {t('statuses.retired', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="INVALID">
            {t('statuses.invalid', { ns: 'common' })}
          </DropdownItem>
          <DropdownItem value="SUGGESTED">
            {t('statuses.suggested', { ns: 'common' })}
          </DropdownItem>
        </DropdownBlock>

        <WiderTextareaBlock
          labelText={t('term-info-label')}
          optionalText={t('optional')}
          visualPlaceholder={t('term-info-placeholder')}
          onChange={(e) =>
            handleUpdate({ key: 'termInfo', value: e.target.value })
          }
          maxLength={TEXT_AREA_MAX}
        />

        <WiderTextareaBlock
          labelText={t('term-scope-label')}
          optionalText={t('optional')}
          hintText={t('term-scope-hint-text')}
          visualPlaceholder={t('term-scope-placeholder')}
          onChange={(e) =>
            handleUpdate({ key: 'scope', value: e.target.value })
          }
          maxLength={TEXT_AREA_MAX}
        />

        <TermEquivalencyBlock>
          <label>
            {t('term-equivalency')}
            <span> ({t('optional')})</span>
          </label>
          <span>{t('term-equivalency-description')}</span>
          <Dropdown
            labelText=""
            labelMode="hidden"
            defaultValue="undefined"
            onChange={(e) => handleUpdate({ key: 'termEquivalency', value: e })}
          >
            <DropdownItem value="undefined">{t('no-selection')}</DropdownItem>
            <DropdownItem value="<">{'<'}</DropdownItem>
            <DropdownItem value=">">{'>'}</DropdownItem>
            <DropdownItem value="~">{t('almost-the-same-as')} (~)</DropdownItem>
          </Dropdown>
        </TermEquivalencyBlock>

        <ListBlock
          update={handleUpdate}
          itemsKey={'source'}
          noLangOption
          title={t('source', { count: 2 })}
          description={t('sources-hint-text-term')}
          addNewText={t('add-new-source')}
          inputLabel={t('source', { count: 1 })}
          inputPlaceholder={t('sources-placeholder')}
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
          maxLength={TEXT_AREA_MAX}
        />
        <WiderTextareaBlock
          labelText={t('term-history-note-label')}
          optionalText={t('optional')}
          hintText={t('term-history-note-hint-text')}
          visualPlaceholder={t('term-history-note-placeholer')}
          onChange={(e) =>
            handleUpdate({ key: 'historyNote', value: e.target.value })
          }
          maxLength={TEXT_AREA_MAX}
        />

        <ListBlock
          update={handleUpdate}
          items={termData.editorialNote}
          itemsKey={'editorialNote'}
          noLangOption
          title={t('editorialNote')}
          description={t('editorialNote-description')}
          addNewText={t('add-new-editorialNote')}
          inputLabel={t('editorialNote-textarea-label-text')}
          inputPlaceholder={t('editorialNote-textarea-placeholder')}
        />

        <Separator isLarge />

        <MediumHeading variant="h2">
          {t('additional-grammatical-information')}
        </MediumHeading>

        <GrammaticalBlock>
          <TextInput
            labelText={t('term-style')}
            optionalText={t('optional')}
            onBlur={(e) =>
              handleUpdate({ key: 'termStyle', value: e.target.value ?? '' })
            }
          />

          <SingleSelect
            ariaOptionsAvailableText={t('available-term-families')}
            clearButtonLabel={t('clear-button-label')}
            labelText={t('term-family')}
            optionalText={t('optional')}
            noItemsText={t('no-term-families-available')}
            visualPlaceholder={t('choose-term-family')}
            items={[
              {
                labelText: t('term-family.masculine', { ns: 'common' }),
                uniqueItemId: 'masculine',
              },
              {
                labelText: t('term-family.neutral', { ns: 'common' }),
                uniqueItemId: 'neutral',
              },
              {
                labelText: t('term-family.feminine', { ns: 'common' }),
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
              {
                labelText: t('term-conjugation.singular', { ns: 'common' }),
                uniqueItemId: 'singular',
              },
              {
                labelText: t('term-conjugation.plural', { ns: 'common' }),
                uniqueItemId: 'plural',
              },
            ]}
            onItemSelectionChange={(e) =>
              handleUpdate({
                key: 'termConjugation',
                value: e?.uniqueItemId || '',
              })
            }
          />

          <SingleSelect
            ariaOptionsAvailableText={t('available-term-word-classes')}
            clearButtonLabel={t('clear-button-label')}
            labelText={t('term-word-class')}
            optionalText={t('optional')}
            noItemsText={t('no-term-word-classes-available')}
            hintText={t('term-word-class-hint-text')}
            visualPlaceholder={t('choose-term-word-class')}
            items={wordClasses}
            onItemSelectionChange={(e) =>
              handleUpdate({ key: 'wordClass', value: e?.uniqueItemId || '' })
            }
          />
        </GrammaticalBlock>
      </ModalContent>

      <ModalFooter>
        <FormFooterAlert
          alerts={Object.keys(invalidData)
            .filter((key) => invalidData[key as keyof typeof invalidData])
            .map((key) => translateEditConceptError(key, t))}
        />
        <Button onClick={() => handleClick()}>{t('accept')}</Button>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function validateFormData(
  data: ConceptTermType,
  recommendedTermLangs: string[]
) {
  const invalidData = {
    prefLabel: false,
    termType: false,
    language: false,
    recommendedTermDuplicate: false,
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

  if (
    data.termType === 'recommended-term' &&
    recommendedTermLangs?.length > 0 &&
    recommendedTermLangs.includes(data.language)
  ) {
    invalidData.recommendedTermDuplicate = true;
  }

  return invalidData;
}

function prefLabelInLangExists(
  data: ConceptTermType,
  recommendedTermLangs: string[]
) {
  if (
    recommendedTermLangs?.length > 0 &&
    recommendedTermLangs.includes(data.language)
  ) {
    return true;
  }
  return false;
}
