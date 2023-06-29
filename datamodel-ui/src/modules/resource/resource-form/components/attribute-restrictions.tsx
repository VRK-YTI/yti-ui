import InlineListBlock from '@app/common/components/inline-list-block';
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
  type,
  applicationProfile,
}: {
  type: ResourceType;
  applicationProfile?: boolean;
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
      />

      <TextInput
        labelText="Enimmäispituus"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
      />

      <TextInput
        labelText="Vähimmäismäärä"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
      />

      <TextInput
        labelText="Enimmäismäärä"
        optionalText={t('optional')}
        visualPlaceholder="Kirjoita arvo"
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
