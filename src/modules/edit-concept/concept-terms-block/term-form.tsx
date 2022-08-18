import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Separator from '@app/common/components/separator';
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from '@app/common/utils/constants';
import {
  translateLanguage,
  translateTermType,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  DropdownItem,
  SingleSelect,
  TextInput,
} from 'suomifi-ui-components';
import { HandleSwitchTermsProps } from '.';
import ListBlock from '../list-block';
import { ConceptTermType, ListType } from '../new-concept.types';
import { FormError } from '../validate-form';
import {
  CheckboxBlock,
  DropdownBlock,
  GrammaticalBlock,
  MediumHeading,
  WiderTextareaBlock,
} from './concept-terms-block.styles';
import TermTypeModal from './term-type-modal';

export interface TermFormProps {
  term: ConceptTermType;
  update: (value: {
    termId: string;
    key: string;
    value: string | ListType[];
  }) => void;
  currentTerms: ConceptTermType[];
  handleSwitchTerms: (value: HandleSwitchTermsProps) => void;
  errors: FormError;
}

export interface TermFormUpdate {
  key: string;
  value: string | ListType[] | null;
}

export default function TermForm({
  term,
  update, errors,
  currentTerms,
  handleSwitchTerms,
}: TermFormProps) {
  const { t } = useTranslation('admin');
  const [modalVisible, setModalVisible] = useState(false);
  const [isHomographic, setIsHomographic] = useState(
    term.termHomographNumber ? true : false
  );
  const [prefLabel, setPrefLabel] = useState(term.prefLabel);

  const termStyle = [
    {
      labelText: t('term-style.spoken-form', { ns: 'common' }),
      uniqueItemId: 'spoken-form',
    },
  ];
  const termFamily = [
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
  ];

  const termConjugation = [
    {
      labelText: t('term-conjugation.singular', { ns: 'common' }),
      uniqueItemId: 'singular',
    },
    {
      labelText: t('term-conjugation.plural', { ns: 'common' }),
      uniqueItemId: 'plural',
    },
  ];

  const wordClass = [
    {
      labelText: t('word-class.adjective', { ns: 'common' }),
      uniqueItemId: 'adjective',
    },
  ];

  const handleUpdate = ({ key, value }: TermFormUpdate) => {
    if (key === 'prefLabel' && typeof value === 'string') {
      setPrefLabel(value);
    }

    update({
      termId: term.id,
      key: key,
      value: typeof value === 'string' ? value.trim() : value ?? '',
    });
  };

  const handleIsHomographic = () => {
    if (isHomographic) {
      handleUpdate({ key: 'termHomographNumber', value: '' });
    }

    setIsHomographic(!isHomographic);
  };

  return (
    <>
      <TextInput
        labelText={t('term-name-label')}
        defaultValue={term.prefLabel}
        onBlur={(e) =>
          handleUpdate({ key: 'prefLabel', value: e.target.value })
        }
        maxLength={TEXT_INPUT_MAX}
        id="term-name-input"
        status={errors.termPrefLabel && prefLabel === '' ? 'error' : 'default'}
      />
      <CheckboxBlock
        defaultChecked={term.termHomographNumber ? true : false}
        onClick={() => handleIsHomographic()}
        id="homograph-checkbox"
      >
        {t('term-is-homograph-label')}
      </CheckboxBlock>

      {isHomographic && (
        <BasicBlock title={t('homograph-number')}>
          <TextInput
            labelText=""
            type="number"
            defaultValue={term.termHomographNumber}
            onChange={(e) =>
              handleUpdate({
                key: 'termHomographNumber',
                value: e?.toString() ?? '',
              })
            }
            min={0}
            id="homograph-number-input"
          />
        </BasicBlock>
      )}

      <BasicBlock title={t('language')}>
        {translateLanguage(term.language, t)} {term.language.toUpperCase()}
      </BasicBlock>
      <BasicBlock
        title={t('term-type-label')}
        extra={
          <BasicBlockExtraWrapper>
            <Button
              variant="secondary"
              onClick={() => setModalVisible(true)}
              id="change-type-button"
            >
              {t('change-term-type')}
            </Button>
            {modalVisible && (
              <TermTypeModal
                currentTerm={term}
                lang={term.language}
                setVisibility={setModalVisible}
                handleUpdate={handleUpdate}
                currentTerms={currentTerms}
                handleSwitchTerms={handleSwitchTerms}
              />
            )}
          </BasicBlockExtraWrapper>
        }
      >
        {translateTermType(term.termType, t)}
      </BasicBlock>
      <DropdownBlock
        labelText={t('term-status-label')}
        defaultValue={term.status}
        onChange={(e) => handleUpdate({ key: 'status', value: e })}
        id="status-picker"
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
        defaultValue={term.termInfo}
        onBlur={(e) => handleUpdate({ key: 'termInfo', value: e.target.value })}
        maxLength={TEXT_AREA_MAX}
        id="info-input"
      />
      <WiderTextareaBlock
        labelText={t('term-scope-label')}
        optionalText={t('optional')}
        hintText={t('term-scope-hint-text')}
        visualPlaceholder={t('term-scope-placeholder')}
        defaultValue={term.scope}
        onBlur={(e) => handleUpdate({ key: 'scope', value: e.target.value })}
        id="scope-input"
        maxLength={TEXT_AREA_MAX}
      />
      <WiderTextareaBlock
        labelText={t('term-sources-label')}
        optionalText={t('optional')}
        hintText={t('term-sources-hint-text')}
        visualPlaceholder={t('term-sources-placeholder')}
        defaultValue={term.source}
        onBlur={(e) => handleUpdate({ key: 'source', value: e.target.value })}
        maxLength={TEXT_AREA_MAX}
        id="sources-input"
      />

      <Separator isLarge />

      <MediumHeading variant="h2">{t('administrative-details')}</MediumHeading>
      <WiderTextareaBlock
        labelText={t('term-change-note-label')}
        optionalText={t('optional')}
        hintText={t('term-change-note-hint-text')}
        visualPlaceholder={t('term-change-note-placeholder')}
        defaultValue={term.changeNote}
        onBlur={(e) =>
          handleUpdate({ key: 'changeNote', value: e.target.value })
        }
        id="change-note-input"
        maxLength={TEXT_AREA_MAX}
      />
      <WiderTextareaBlock
        labelText={t('term-history-note-label')}
        optionalText={t('optional')}
        hintText={t('term-history-note-hint-text')}
        visualPlaceholder={t('term-history-note-placeholer')}
        defaultValue={term.historyNote}
        onBlur={(e) =>
          handleUpdate({ key: 'historyNote', value: e.target.value })
        }
        maxLength={TEXT_AREA_MAX}
        id="history-note-input"
      />

      <ListBlock
        update={handleUpdate}
        items={term.editorialNote}
        itemsKey={'editorialNote'}
        noLangOption
        title={t('editorialNote')}
        description={t('editorialNote-description')}
        addNewText={t('add-new-editorialNote')}
        inputLabel={t('editorialNote-textarea-label-text')}
        inputPlaceholder={t('editorialNote-textarea-placeholder')}
        errors={errors}
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
          items={termStyle}
          defaultSelectedItem={
            term.termStyle
              ? termStyle.filter(
                  (ts) =>
                    ts.uniqueItemId === term.termStyle ||
                    ts.labelText === term.termStyle
                )[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate({ key: 'termStyle', value: e })}
          id="style-picker"
        />

        <SingleSelect
          ariaOptionsAvailableText={t('available-term-families')}
          clearButtonLabel={t('clear-button-label')}
          labelText={t('term-family')}
          optionalText={t('optional')}
          noItemsText={t('no-term-families-available')}
          visualPlaceholder={t('choose-term-family')}
          items={termFamily}
          defaultSelectedItem={
            term.termFamily
              ? termFamily.filter(
                  (ts) =>
                    ts.uniqueItemId === term.termFamily ||
                    ts.labelText === term.termFamily
                )[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate({ key: 'termFamily', value: e })}
          id="family-picker"
        />

        <SingleSelect
          ariaOptionsAvailableText={t('available-term-conjugations')}
          clearButtonLabel={t('clear-button-label')}
          labelText={t('term-conjugation')}
          optionalText={t('optional')}
          noItemsText={t('no-term-conjugations-available')}
          visualPlaceholder={t('choose-term-conjugation')}
          items={termConjugation}
          defaultSelectedItem={
            term.termConjugation
              ? termConjugation.filter(
                  (ts) =>
                    ts.uniqueItemId === term.termConjugation ||
                    ts.labelText === term.termConjugation
                )[0]
              : undefined
          }
          onItemSelect={(e) =>
            handleUpdate({ key: 'termConjugation', value: e })
          }
          id="conjugations-picker"
        />

        <SingleSelect
          ariaOptionsAvailableText={t('available-term-word-classes')}
          clearButtonLabel={t('clear-button-label')}
          labelText={t('term-word-class')}
          optionalText={t('optional')}
          noItemsText={t('no-term-word-classes-available')}
          hintText={t('term-word-class-hint-text')}
          visualPlaceholder={t('choose-term-word-class')}
          items={wordClass}
          defaultSelectedItem={
            term.wordClass
              ? wordClass.filter(
                  (ts) =>
                    ts.uniqueItemId === term.wordClass ||
                    ts.labelText === term.wordClass
                )[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate({ key: 'wordClass', value: e })}
          id="word-class-picker"
        />
      </GrammaticalBlock>
    </>
  );
}
