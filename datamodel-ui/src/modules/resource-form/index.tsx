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
            labelText={t('attributes-identifier')}
            defaultValue={data.identifier}
          />

          <div>
            <InlineListBlock
              addNewComponent={
                <Button variant="secondary">{t('select-attribute')}</Button>
              }
              handleRemoval={() => null}
              items={[
                {
                  id: 'id-001',
                  label: 'Testi',
                },
              ]}
              label={`${t('target-attribute')} (?)`}
            />
          </div>

          <div>
            <Dropdown labelText={t('range')} defaultValue="literal">
              <DropdownItem value="literal">{t('literal')}</DropdownItem>
            </Dropdown>
          </div>

          <div>
            <Dropdown labelText={t('status')} defaultValue="DRAFT">
              {statuses.map((status) => (
                <DropdownItem key={`status-${status}`} value={status}>
                  {translateStatus(status, t)}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          <Separator />

          <div>
            <Text className="form-label">{t('restrictions')}</Text>
          </div>

          <div>
            <InlineListBlock
              addNewComponent={
                <Button variant="secondary" icon="plus">
                  {t('add-reference-data')}
                </Button>
              }
              handleRemoval={() => null}
              items={[
                {
                  id: 'id-001',
                  label: 'Testi',
                },
              ]}
              label={`${t('codelist')} (?)`}
            />
          </div>

          <div>
            <StyledDropdown
              labelText={t('allowed-values')}
              visualPlaceholder={t('select-values')}
              $noValue={true}
            >
              <DropdownItem value="test">Placeholder</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <StyledDropdown
              labelText={t('default-value')}
              visualPlaceholder={t('select-value')}
              $noValue={true}
            >
              <DropdownItem value="test">Placeholder</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <StyledDropdown
              labelText={t('required-value')}
              visualPlaceholder={t('select-value')}
              $noValue={true}
            >
              <DropdownItem value="test">Placeholder</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <TextInput
              labelText={t('minimum-length')}
              visualPlaceholder={t('input-value')}
            />
          </div>
          <div>
            <TextInput
              labelText={t('maximum-length')}
              visualPlaceholder={t('input-value')}
            />
          </div>
          <div>
            <TextInput
              labelText={t('minimum-amount')}
              visualPlaceholder={t('input-value')}
            />
          </div>
          <div>
            <TextInput
              labelText={t('maximum-amount')}
              visualPlaceholder={t('input-value')}
            />
          </div>

          <Separator />

          <LanguageVersionedWrapper>
            {langs.map((l) => (
              <Textarea
                key={`${data.identifier}-description-${l}`}
                labelText={`${t('technical-description')}, ${l}`}
                optionalText={t('optional')}
              />
            ))}
          </LanguageVersionedWrapper>

          <Textarea
            labelText={t('work-group-comment')}
            optionalText={t('optional')}
          />
        </FormWrapper>
      </ExpanderContent>
    </ExpanderWithDisable>
  );
}
