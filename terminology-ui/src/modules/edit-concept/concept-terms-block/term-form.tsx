import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import { useBreakpoints } from 'yti-common-ui/media-query';
import Separator from 'yti-common-ui/separator';
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from '@app/common/utils/constants';
import {
  translateLanguage,
  translateTermType,
  translateWordClass,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Dropdown,
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
  HomographTextInput,
  MediumHeading,
  TermEquivalencyBlock,
  TermFormBottomBlock,
  TermFormRemoveButton,
  TermFormTopBlock,
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
  handleRemoveTerm?: (value: string) => void;
}

export interface TermFormUpdate {
  key: string;
  value: string | ListType[] | null;
}

export default function TermForm({
  term,
  update,
  errors,
  currentTerms,
  handleSwitchTerms,
  handleRemoveTerm,
}: TermFormProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [modalVisible, setModalVisible] = useState(false);
  const [isHomographic, setIsHomographic] = useState(
    term.termHomographNumber ? true : false
  );
  const [prefLabel, setPrefLabel] = useState(term.prefLabel);

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
      <TermFormTopBlock>
        <TextInput
          labelText={t('term-name-label')}
          defaultValue={term.prefLabel}
          onBlur={(e) =>
            handleUpdate({ key: 'prefLabel', value: e.target.value })
          }
          maxLength={TEXT_INPUT_MAX}
          id={`term-name-input_${term.id}`}
          status={
            errors.termPrefLabel && prefLabel === '' ? 'error' : 'default'
          }
        />
        {handleRemoveTerm && !isSmall && (
          <TermFormRemoveButton
            variant="secondaryNoBorder"
            icon="remove"
            onClick={() => handleRemoveTerm(term.id)}
          >
            {t('remove-term', { count: 1 })}
          </TermFormRemoveButton>
        )}
      </TermFormTopBlock>
      <CheckboxBlock
        defaultChecked={term.termHomographNumber ? true : false}
        onClick={() => handleIsHomographic()}
        id={`homograph-checkbox_${term.id}`}
        variant={isSmall ? 'large' : 'small'}
      >
        {t('term-is-homograph-label')}
      </CheckboxBlock>

      {isHomographic && (
        <HomographTextInput
          labelText={t('homograph-number')}
          type="number"
          defaultValue={term.termHomographNumber}
          onChange={(e) =>
            handleUpdate({
              key: 'termHomographNumber',
              value: e?.toString() ?? '',
            })
          }
          min={0}
          id={`homograph-number-input_${term.id}`}
        />
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
              id={`change-type-button_${term.id}`}
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
        id={`status-picker_${term.id}`}
        $isSmall={isSmall}
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
        id={`info-input_${term.id}`}
      />
      <WiderTextareaBlock
        labelText={t('term-scope-label')}
        optionalText={t('optional')}
        hintText={t('term-scope-hint-text')}
        visualPlaceholder={t('term-scope-placeholder')}
        defaultValue={term.scope}
        onBlur={(e) => handleUpdate({ key: 'scope', value: e.target.value })}
        id={`scope-input_${term.id}`}
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
          defaultValue={term.termEquivalency}
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
        items={term.source}
        itemsKey={'source'}
        noLangOption
        title={t('source', { count: 2 })}
        description={t('sources-hint-text-term')}
        addNewText={t('add-new-source')}
        inputLabel={t('source', { count: 1 })}
        inputPlaceholder={t('sources-placeholder')}
        errors={errors}
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
        id={`change-note-input_${term.id}`}
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
        id={`history-note-input_${term.id}`}
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

      <GrammaticalBlock $isSmall={isSmall}>
        <TextInput
          labelText={t('term-style')}
          defaultValue={term.termStyle}
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
          id={`family-picker_${term.id}`}
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
                )[0] ?? {
                  uniqueItemdId: term.termConjugation,
                  labelText: term.termConjugation,
                }
              : undefined
          }
          onItemSelect={(e) =>
            handleUpdate({ key: 'termConjugation', value: e })
          }
          id={`conjugations-picker_${term.id}`}
          status={
            term.termConjugation &&
            !termConjugation
              .map((c) => c.uniqueItemId)
              .includes(term.termConjugation) &&
            errors.termConjugation
              ? 'error'
              : 'default'
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
          defaultSelectedItem={
            term.wordClass
              ? wordClasses.filter(
                  (ts) =>
                    ts.uniqueItemId === term.wordClass ||
                    ts.labelText === term.wordClass
                )[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate({ key: 'wordClass', value: e })}
          id={`word-class-picker_${term.id}`}
        />
        {handleRemoveTerm && isSmall && (
          <TermFormBottomBlock>
            <TermFormRemoveButton
              variant="secondaryNoBorder"
              icon="remove"
              onClick={() => handleRemoveTerm(term.id)}
            >
              {t('remove-term', { count: 1 })}
            </TermFormRemoveButton>
          </TermFormBottomBlock>
        )}
      </GrammaticalBlock>
    </>
  );
}
