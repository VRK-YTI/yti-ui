import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  ExpanderContent,
  ExpanderTitleButton,
  Text,
  TextInput,
  Textarea,
} from 'suomifi-ui-components';
import ConceptBlock from '../concept-block';
import Separator from 'yti-common-ui/separator';
import {
  LanguageVersionedWrapper,
  FormWrapper,
  StyledDropdown,
  ExpanderWithDisable,
} from './resource-form.styles';
import { statusList } from 'yti-common-ui/utils/status-list';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import InlineListBlock from '@app/common/components/inline-list-block';
import { translateLanguage } from '@app/common/utils/translation-helpers';

export default function ResourceForm({
  data,
  langs,
  type,
  disabled = false,
}: {
  data: {
    identifier: string;
    label: {
      [key: string]: string;
    };
    modelId: string;
    uri: string;
  };
  langs: string[];
  type: 'association' | 'attribute';
  disabled?: boolean;
}) {
  const { t, i18n } = useTranslation('admin');
  const statuses = statusList;
  const [open, setOpen] = useState(false);

  return (
    <ExpanderWithDisable
      open={open}
      onOpenChange={() => setOpen(!open)}
      $disabled={disabled}
    >
      <ExpanderTitleButton>
        {getLanguageVersion({
          data: data.label,
          lang: i18n.language,
          appendLocale: true,
        })}
      </ExpanderTitleButton>
      <ExpanderContent>
        <FormWrapper>
          <ConceptBlock setConcept={() => null} terminologies={[]} />

          <LanguageVersionedWrapper>
            {langs.map((l) => (
              <TextInput
                key={`${data.identifier}-text-input-${l}`}
                labelText={`${
                  type === 'association'
                    ? t('association-name')
                    : t('attribute-name')
                }, ${translateLanguage(l, t)} (${l.toUpperCase()})`}
                defaultValue={data.label[l] ?? ''}
              />
            ))}
          </LanguageVersionedWrapper>

          <TextInput
            labelText="Attribuutin yksilöivä tunnus"
            defaultValue={data.identifier}
          />

          <div>
            <InlineListBlock
              addNewComponent={
                <Button variant="secondary">Valitse attribuutti</Button>
              }
              handleRemoval={() => null}
              items={[
                {
                  id: 'id-001',
                  label: 'Testi',
                },
              ]}
              label="Kohdistuu attribuuttiin (?)"
            />
          </div>

          <div>
            <Dropdown labelText="Tietotyyppi" defaultValue="literal">
              <DropdownItem value="literal">Literaali</DropdownItem>
            </Dropdown>
          </div>

          <div>
            <Dropdown labelText="Tila" defaultValue="DRAFT">
              {statuses.map((status) => (
                <DropdownItem key={`status-${status}`} value={status}>
                  {translateStatus(status, t)}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          <Separator />

          <div>
            <Text className="form-label">Rajoitteet</Text>
          </div>

          <div>
            <InlineListBlock
              addNewComponent={
                <Button variant="secondary" icon="plus">
                  Lisää koodisto
                </Button>
              }
              handleRemoval={() => null}
              items={[
                {
                  id: 'id-001',
                  label: 'Testi',
                },
              ]}
              label="Koodisto (?)"
            />
          </div>

          <div>
            <StyledDropdown
              labelText="Sallitut arvot"
              visualPlaceholder="Valitse arvot"
              $noValue={true}
            >
              <DropdownItem value="test">Test</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <StyledDropdown
              labelText="Oletusarvo"
              visualPlaceholder="Valitse arvo"
              $noValue={true}
            >
              <DropdownItem value="test">Test</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <StyledDropdown
              labelText="Pakollinen arvo"
              visualPlaceholder="Valitse arvo"
              $noValue={true}
            >
              <DropdownItem value="test">Test</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <TextInput
              labelText="Vähimmäispituus"
              visualPlaceholder="Kirjoita arvo"
            />
          </div>
          <div>
            <TextInput
              labelText="Enimmäispituus"
              visualPlaceholder="Kirjoita arvo"
            />
          </div>
          <div>
            <TextInput
              labelText="Vähimmäismäärä"
              visualPlaceholder="Kirjoita arvo"
            />
          </div>
          <div>
            <TextInput
              labelText="Enimmäismäärä"
              visualPlaceholder="Kirjoita arvo"
            />
          </div>
          <Separator />

          <LanguageVersionedWrapper>
            {langs.map((l) => (
              <Textarea
                key={`${data.identifier}-description-${l}`}
                labelText={`Tekninen kuvaus, ${l}`}
                optionalText={t('optional')}
              />
            ))}
          </LanguageVersionedWrapper>

          <Textarea
            labelText="Työryhmän sisäiset kommenttit"
            optionalText={t('optional')}
          />
        </FormWrapper>
      </ExpanderContent>
    </ExpanderWithDisable>
  );
}
