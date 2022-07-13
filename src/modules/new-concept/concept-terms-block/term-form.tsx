import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import {
  Button,
  DropdownItem,
  SingleSelect,
  TextInput,
} from 'suomifi-ui-components';
import {
  CheckboxBlock,
  DropdownBlock,
  GrammaticalBlock,
  MediumHeading,
  WiderTextareaBlock,
} from './concept-terms-block.styles';
import NotesBlock from './notes-block';

export interface TermFormProps {
  lang: string;
}

export default function TermForm({ lang }: TermFormProps) {
  const { t } = useTranslation('admin');
  return (
    <>
      <TextInput labelText={t('term-name-label')} />
      <CheckboxBlock>{t('term-is-homograph-label')}</CheckboxBlock>
      <BasicBlock title={t('language')}>
        {t(`language-label-text-${lang}`)}
      </BasicBlock>
      <BasicBlock
        title={t('term-type-label')}
        extra={
          <BasicBlockExtraWrapper>
            <Button variant="secondary">{t('change-term-type')}</Button>
          </BasicBlockExtraWrapper>
        }
      >
        {t('concept-preferred-terms-title')}
      </BasicBlock>
      <DropdownBlock labelText={t('term-status-label')} defaultValue="draft">
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
      />
      <WiderTextareaBlock
        labelText={t('term-scope-label')}
        optionalText={t('optional')}
        hintText={t('term-scope-hint-text')}
        visualPlaceholder={t('term-scope-placeholder')}
      />
      <WiderTextareaBlock
        labelText={t('term-sources-label')}
        optionalText={t('optional')}
        hintText={t('term-sources-hint-text')}
        visualPlaceholder={t('term-sources-placeholder')}
      />

      <Separator isLarge />

      <MediumHeading variant="h2">{t('administrative-details')}</MediumHeading>
      <WiderTextareaBlock
        labelText={t('term-change-note-label')}
        optionalText={t('optional')}
        hintText={t('term-change-note-hint-text')}
        visualPlaceholder={t('term-change-note-placeholder')}
      />
      <WiderTextareaBlock
        labelText={t('term-history-note-label')}
        optionalText={t('optional')}
        hintText={t('term-history-note-hint-text')}
        visualPlaceholder={t('term-history-note-placeholer')}
      />

      <NotesBlock />

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
          items={[{ labelText: 'puhekieli', uniqueItemId: 'spoken form' }]}
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
        />

        <SingleSelect
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          labelText="Termin sanaluokka"
          optionalText="valinnainen"
          noItemsText=""
          hintText="Merkitään jos termi on eri sanaluokasta kuin muunkieliset termit."
          visualPlaceholder="Valitse sanaluokka"
          items={[]}
        />
      </GrammaticalBlock>
    </>
  );
}
