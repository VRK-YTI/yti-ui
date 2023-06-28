import InlineListBlock from '@app/common/components/inline-list-block';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import { Button, TextInput } from 'suomifi-ui-components';

export default function AssociationRestrictions({
  type,
  applicationProfile,
}: {
  type: ResourceType;
  applicationProfile?: boolean;
}) {
  const { t } = useTranslation('admin');

  if (type !== ResourceType.ASSOCIATION) {
    return <></>;
  }

  if (applicationProfile) {
    return (
      <>
        <InlineListBlock
          addNewComponent={
            <Button variant="secondary">Valitse assosiaatio</Button>
          }
          handleRemoval={() => null}
          items={[]}
          label="Kohdistuu assosiaatioon"
        />

        <InlineListBlock
          addNewComponent={<Button variant="secondary">Valitse luokka</Button>}
          handleRemoval={() => null}
          items={[]}
          label="Assosiaation kohteen luokka"
        />

        <TextInput labelText="Vähimmäismäärä" optionalText={t('optional')} />

        <TextInput labelText="Enimmäismäärä" optionalText={t('optional')} />
      </>
    );
  }

  return <></>;
}
