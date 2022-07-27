import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  DropdownItem,
  SingleSelect,
  TextInput,
} from 'suomifi-ui-components';
import ListBlock from '../list-block';
import { ConceptTermType, ListType } from '../new-concept.types';
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
}

export interface TermFormUpdate {
  key: string;
  value: string | ListType[] | null;
}

export default function TermForm({ term, update }: TermFormProps) {
  const { t } = useTranslation('admin');
  const [modalVisible, setModalVisible] = useState(false);
  const [isHomographic, setIsHomographic] = useState(
    term.termHomographNumber ? true : false
  );

  const termStyle = [
    { labelText: t('spoken-form'), uniqueItemId: 'spoken-form' },
  ];
  const termFamily = [
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
  ];

  const termConjugation = [
    { labelText: t('singular'), uniqueItemId: 'singular' },
    { labelText: t('plural'), uniqueItemId: 'plural' },
  ];

  const wordClass = [{ labelText: t('adjective'), uniqueItemId: 'adjective' }];

  const handleUpdate = ({ key, value }: TermFormUpdate) => {
    update({
      termId: term.id,
      key: key,
      value: value ?? '',
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
      />
      <CheckboxBlock
        defaultChecked={term.termHomographNumber ? true : false}
        onClick={() => handleIsHomographic()}
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
          />
        </BasicBlock>
      )}

      <BasicBlock title={t('language')}>
        {t(`language-label-text-${term.language}`)}
      </BasicBlock>
      <BasicBlock
        title={t('term-type-label')}
        extra={
          <BasicBlockExtraWrapper>
            <Button variant="secondary" onClick={() => setModalVisible(true)}>
              {t('change-term-type')}
            </Button>
            {modalVisible && (
              <TermTypeModal
                setVisibility={setModalVisible}
                handleUpdate={handleUpdate}
              />
            )}
          </BasicBlockExtraWrapper>
        }
      >
        {t(
          term.termType === 'recommended-term'
            ? `${term.termType}-no-suff`
            : term.termType
        )}
      </BasicBlock>
      <DropdownBlock
        labelText={t('term-status-label')}
        defaultValue={term.status}
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
        defaultValue={term.termInfo}
        onBlur={(e) => handleUpdate({ key: 'termInfo', value: e.target.value })}
      />
      <WiderTextareaBlock
        labelText={t('term-scope-label')}
        optionalText={t('optional')}
        hintText={t('term-scope-hint-text')}
        visualPlaceholder={t('term-scope-placeholder')}
        defaultValue={term.scope}
        onBlur={(e) => handleUpdate({ key: 'scope', value: e.target.value })}
      />
      <WiderTextareaBlock
        labelText={t('term-sources-label')}
        optionalText={t('optional')}
        hintText={t('term-sources-hint-text')}
        visualPlaceholder={t('term-sources-placeholder')}
        defaultValue={term.source}
        onBlur={(e) => handleUpdate({ key: 'source', value: e.target.value })}
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
      />

      <ListBlock
        update={handleUpdate}
        items={term.editorialNote}
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
          items={termStyle}
          defaultSelectedItem={
            term.termStyle
              ? termStyle.filter((ts) => ts.uniqueItemId === term.termStyle)[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate({ key: 'termStyle', value: e })}
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
                  (ts) => ts.uniqueItemId === term.termFamily
                )[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate({ key: 'termFamily', value: e })}
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
                  (ts) => ts.uniqueItemId === term.termConjugation
                )[0]
              : undefined
          }
          onItemSelect={(e) =>
            handleUpdate({ key: 'termConjugation', value: e })
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
          items={wordClass}
          defaultSelectedItem={
            term.wordClass
              ? wordClass.filter((ts) => ts.uniqueItemId === term.wordClass)[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate({ key: 'wordClass', value: e })}
        />
      </GrammaticalBlock>
    </>
  );
}
