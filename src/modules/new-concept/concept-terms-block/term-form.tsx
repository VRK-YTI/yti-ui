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
import { ConceptTermType, ItemType } from './concept-term-block-types';
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
    key: keyof ConceptTermType;
    value: string | ItemType[];
  }) => void;
}

export default function TermForm({ term, update }: TermFormProps) {
  const { t } = useTranslation('admin');
  const [modalVisible, setModalVisible] = useState(false);
  const [isHomographic, setIsHomographic] = useState(
    term.termHomographNumber ? true : false
  );

  const termStyle = [{ labelText: 'puhekieli', uniqueItemId: 'spoken-form' }];
  const termFamily = [
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
  ];

  const termConjugation = [
    { labelText: 'yksikkö', uniqueItemId: 'singular' },
    { labelText: 'monikko', uniqueItemId: 'plural' },
  ];

  const wordClass = [{ labelText: 'adj.', uniqueItemId: 'adjective' }];

  const handleUpdate = (
    key: keyof ConceptTermType,
    value?: string | ItemType[] | null
  ) => {
    update({
      termId: term.id,
      key: key as keyof ConceptTermType,
      value: value as string | ItemType[],
    });
  };

  const handleIsHomographic = () => {
    if (isHomographic) {
      handleUpdate('termHomographNumber', '');
    }

    setIsHomographic(!isHomographic);
  };

  return (
    <>
      <TextInput
        labelText={t('term-name-label')}
        defaultValue={term.prefLabel}
        onBlur={(e) => handleUpdate('prefLabel', e.target.value)}
      />
      <CheckboxBlock
        defaultChecked={term.termHomographNumber ? true : false}
        onClick={() => handleIsHomographic()}
      >
        {t('term-is-homograph-label')}
      </CheckboxBlock>

      {isHomographic && (
        <BasicBlock title={'Homonyymin järjestysnumero'}>
          <TextInput
            labelText=""
            type="number"
            defaultValue={term.termHomographNumber}
            onChange={(e) => handleUpdate('termHomographNumber', e?.toString())}
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
            {modalVisible && <TermTypeModal setVisibility={setModalVisible} />}
          </BasicBlockExtraWrapper>
        }
      >
        {t('concept-preferred-terms-title')}
      </BasicBlock>
      <DropdownBlock
        labelText={t('term-status-label')}
        defaultValue={term.status}
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
        defaultValue={term.termInfo}
        onBlur={(e) => handleUpdate('termInfo', e.target.value)}
      />
      <WiderTextareaBlock
        labelText={t('term-scope-label')}
        optionalText={t('optional')}
        hintText={t('term-scope-hint-text')}
        visualPlaceholder={t('term-scope-placeholder')}
        defaultValue={term.scope}
        onBlur={(e) => handleUpdate('scope', e.target.value)}
      />
      <WiderTextareaBlock
        labelText={t('term-sources-label')}
        optionalText={t('optional')}
        hintText={t('term-sources-hint-text')}
        visualPlaceholder={t('term-sources-placeholder')}
        defaultValue={term.source}
        onBlur={(e) => handleUpdate('source', e.target.value)}
      />

      <Separator isLarge />

      <MediumHeading variant="h2">{t('administrative-details')}</MediumHeading>
      <WiderTextareaBlock
        labelText={t('term-change-note-label')}
        optionalText={t('optional')}
        hintText={t('term-change-note-hint-text')}
        visualPlaceholder={t('term-change-note-placeholder')}
        defaultValue={term.changeNote}
        onBlur={(e) => handleUpdate('changeNote', e.target.value)}
      />
      <WiderTextareaBlock
        labelText={t('term-history-note-label')}
        optionalText={t('optional')}
        hintText={t('term-history-note-hint-text')}
        visualPlaceholder={t('term-history-note-placeholer')}
        defaultValue={term.historyNote}
        onBlur={(e) => handleUpdate('historyNote', e.target.value)}
      />

      <ListBlock
        update={handleUpdate}
        items={term.editorialNote}
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
          items={termStyle}
          defaultSelectedItem={
            term.termStyle
              ? termStyle.filter((ts) => ts.uniqueItemId === term.termStyle)[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate('termStyle', e)}
        />

        <SingleSelect
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          labelText="Termin suku"
          optionalText="valinnainen"
          noItemsText=""
          visualPlaceholder="Valitse termin suku"
          items={termFamily}
          defaultSelectedItem={
            term.termFamily
              ? termFamily.filter(
                  (ts) => ts.uniqueItemId === term.termFamily
                )[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate('termFamily', e)}
        />

        <SingleSelect
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          labelText="Termin luku"
          optionalText="valinnainen"
          noItemsText=""
          visualPlaceholder="Valitse termin luku"
          items={termConjugation}
          defaultSelectedItem={
            term.termConjugation
              ? termConjugation.filter(
                  (ts) => ts.uniqueItemId === term.termConjugation
                )[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate('termConjugation', e)}
        />

        <SingleSelect
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          labelText="Termin sanaluokka"
          optionalText="valinnainen"
          noItemsText=""
          hintText="Merkitään jos termi on eri sanaluokasta kuin muunkieliset termit."
          visualPlaceholder="Valitse sanaluokka"
          items={wordClass}
          defaultSelectedItem={
            term.wordClass
              ? wordClass.filter((ts) => ts.uniqueItemId === term.wordClass)[0]
              : undefined
          }
          onItemSelect={(e) => handleUpdate('wordClass', e)}
        />
      </GrammaticalBlock>
    </>
  );
}
