import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
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
import {
  CheckboxBlock,
  DropdownBlock,
  GrammaticalBlock,
  MediumHeading,
  RadioButtonGroupSpaced,
  TermEquivalencyBlock,
  WiderTextareaBlock,
} from './concept-terms-block.styles';
import NotesBlock from './notes-block';

interface NewTermModalProps {
  setVisible: (value: boolean) => void;
  languages: string[];
}

export default function NewTermModal({
  setVisible,
  languages,
}: NewTermModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();

  return (
    <Modal
      appElementId="__next"
      onEscKeyDown={() => setVisible(false)}
      visible={true}
      variant={!isSmall ? 'default' : 'smallScreen'}
    >
      <ModalContent>
        <ModalTitle>Uusi termi</ModalTitle>

        <TextInput labelText={t('term-name-label')} />
        <CheckboxBlock>{t('term-is-homograph-label')}</CheckboxBlock>

        <RadioButtonGroupSpaced labelText="Termin typppi" name="">
          <RadioButton
            value="Synonyymi"
            hintText="Termi, jolla on lähes sama merkitys kuin suositettavalla termillä"
          >
            Synonyymi
          </RadioButton>
          <RadioButton
            value="Ei suositettava synonyymi"
            hintText="Termi, joka ei kuvaa kielellisesti hyvin käsitettä"
          >
            Ei suositettava synonyymi
          </RadioButton>
          <RadioButton
            value="Hakutermi"
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
        />

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

        <TermEquivalencyBlock>
          <label>
            Termin vastaavuus
            <span> ({t('optional')})</span>
          </label>
          <span>
            Termin vastaavuus liittyy saman kieliversion suositettavaan termiin
          </span>
          <Dropdown labelText="" defaultValue="undefined">
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
        />
        <WiderTextareaBlock
          labelText={t('term-history-note-label')}
          optionalText={t('optional')}
          hintText={t('term-history-note-hint-text')}
          visualPlaceholder={t('term-history-note-placeholer')}
        />

        <NotesBlock update={() => {console.log('temp');}} />

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

          <Dropdown
            labelText="Termin vastaavuus"
            optionalText={t('optional')}
            defaultValue="undefined"
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
            items={[]}
          />
        </GrammaticalBlock>
      </ModalContent>

      <ModalFooter>
        <Button>Hyväksy</Button>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          Peruuta
        </Button>
      </ModalFooter>
    </Modal>
  );
}
