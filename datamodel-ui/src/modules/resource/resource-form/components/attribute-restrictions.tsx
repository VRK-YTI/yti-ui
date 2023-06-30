import InlineListBlock from '@app/common/components/inline-list-block';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import {
  Button,
  IconPlus,
  SingleSelect,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';

export default function AttributeRestrictions({
  data,
  type,
  applicationProfile,
  handleUpdate,
}: {
  data: ResourceFormType;
  type: ResourceType;
  applicationProfile?: boolean;
  handleUpdate: (
    key: keyof ResourceFormType,
    value: ResourceFormType[typeof key]
  ) => void;
}) {
  const { t } = useTranslation('admin');

  if (type !== ResourceType.ATTRIBUTE || !applicationProfile) {
    return <></>;
  }

  return (
    <>
      <Separator />

      <div style={{ marginBottom: '10px' }}>
        <Text variant="bold">Rajoitteet</Text>
      </div>

      <InlineListBlock
        addNewComponent={
          <Button variant="secondary" icon={<IconPlus />}>
            Lisää koodisto
          </Button>
        }
        handleRemoval={() => null}
        items={[]}
        label="Koodisto"
      />

      <SingleSelect
        labelText="Sallitut arvot"
        clearButtonLabel=""
        itemAdditionHelpText=""
        ariaOptionsAvailableText=""
        items={[]}
        optionalText={t('optional')}
        visualPlaceholder="Valitse arvot"
      />

      <SingleSelect
        labelText="Oletusarvo"
        clearButtonLabel=""
        itemAdditionHelpText=""
        ariaOptionsAvailableText=""
        items={[]}
        optionalText={t('optional')}
        visualPlaceholder="Valitse arvo"
      />

      <SingleSelect
        labelText="Pakollinen arvo"
        clearButtonLabel=""
        itemAdditionHelpText=""
        ariaOptionsAvailableText=""
        items={[]}
        optionalText={t('optional')}
        visualPlaceholder="Valitse arvo"
      />

      <TextInput
        labelText="Vähimmäispituus"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
        defaultValue={data.minLength}
        onChange={(e) => handleUpdate('minLength', e?.toString() ?? '')}
      />

      <TextInput
        labelText="Enimmäispituus"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
        defaultValue={data.maxLength}
        onChange={(e) => handleUpdate('maxLength', e?.toString() ?? '')}
      />

      <TextInput
        labelText="Vähimmäismäärä"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
        defaultValue={data.minCount}
        onChange={(e) => handleUpdate('minCount', e?.toString() ?? '')}
      />

      <TextInput
        labelText="Enimmäismäärä"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
        defaultValue={data.maxCount}
        onChange={(e) => handleUpdate('maxCount', e?.toString() ?? '')}
      />

      <TextInput
        labelText="Suurempi tai yhtä suuri kuin"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
      />

      <TextInput
        labelText="Pienempi tai yhtä pieni kuin"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
      />

      <TextInput
        labelText="Suurempi kuin"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
      />

      <TextInput
        labelText="Pienempi kuin"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
      />

      <TextInput
        labelText="Merkkijonattribuutin muoto"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
      />

      <SingleSelect
        labelText="Merkkijonoattribuutin sallitut kielet"
        clearButtonLabel=""
        itemAdditionHelpText=""
        ariaOptionsAvailableText=""
        items={[]}
        optionalText={t('optional')}
        visualPlaceholder="Valitse kielet"
      />

      <Separator />
    </>
  );
}
