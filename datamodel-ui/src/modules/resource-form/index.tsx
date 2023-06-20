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
            id="resource-identifier-input"
          />

          <div>
            <InlineListBlock
              addNewComponent={
                <Button variant="secondary" id="select-resource-button">
                  {t('select-attribute')}
                </Button>
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
            <Dropdown
              labelText={t('range')}
              defaultValue="literal"
              id="resource-range-dropdown"
            >
              <DropdownItem value="literal">{t('literal')}</DropdownItem>
            </Dropdown>
          </div>

          <div>
            <Dropdown
              labelText={t('status')}
              defaultValue="DRAFT"
              id="resource-status-dropdown"
            >
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
                <Button
                  variant="secondary"
                  icon="plus"
                  id="add-reference-data-button"
                >
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
              id="resource-allowed-values-dropdown"
            >
              <DropdownItem value="test">Placeholder</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <StyledDropdown
              labelText={t('default-value')}
              visualPlaceholder={t('select-value')}
              $noValue={true}
              id="resource-default-value-dropdown"
            >
              <DropdownItem value="test">Placeholder</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <StyledDropdown
              labelText={t('required-value')}
              visualPlaceholder={t('select-value')}
              $noValue={true}
              id="resource-required-value-dropdown"
            >
              <DropdownItem value="test">Placeholder</DropdownItem>
            </StyledDropdown>
          </div>
          <div>
            <TextInput
              labelText={t('minimum-length')}
              visualPlaceholder={t('input-value')}
              id="minimum-length-input"
            />
          </div>
          <div>
            <TextInput
              labelText={t('maximum-length')}
              visualPlaceholder={t('input-value')}
              id="maximum-length-input"
            />
          </div>
          <div>
            <TextInput
              labelText={t('minimum-amount')}
              visualPlaceholder={t('input-value')}
              id="minimum-amount-input"
            />
          </div>
          <div>
            <TextInput
              labelText={t('maximum-amount')}
              visualPlaceholder={t('input-value')}
              id="maximum-amount-input"
            />
          </div>

          <Separator />

          <LanguageVersionedWrapper>
            {langs.map((l) => (
              <Textarea
                key={`${data.identifier}-description-${l}`}
                labelText={`${t('technical-description')}, ${l}`}
                optionalText={t('optional')}
                id="resource-description-input"
              />
            ))}
          </LanguageVersionedWrapper>

          <Textarea
            labelText={t('work-group-comment')}
            optionalText={t('optional')}
            id="resource-work-group-comment-input"
          />
        </FormWrapper>
      </ExpanderContent>
    </ExpanderWithDisable>
  );
}
