import InlineListBlock from '@app/common/components/inline-list-block';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import { TextInput } from 'suomifi-ui-components';
import ResourceModal from '../../resource-modal';
import ClassModal from '@app/modules/class-modal';
import { InternalClassInfo } from '@app/common/interfaces/internal-class.interface';

export default function AssociationRestrictions({
  modelId,
  data,
  type,
  applicationProfile,
  handleUpdate,
}: {
  modelId: string;
  data: ResourceFormType;
  type: ResourceType;
  applicationProfile?: boolean;
  handleUpdate: (
    key: keyof ResourceFormType,
    value: ResourceFormType[typeof key]
  ) => void;
}) {
  const { t } = useTranslation('admin');

  const handleClassUpdate = (
    value?: InternalClassInfo,
    targetIsAppProfile?: boolean
  ) => {
    handleUpdate('classType', value ? value.id : undefined);
  };

  if (type !== ResourceType.ASSOCIATION) {
    return <></>;
  }

  if (applicationProfile) {
    return (
      <>
        <InlineListBlock
          addNewComponent={
            <ResourceModal
              modelId={modelId}
              type={type}
              buttonTranslations={{
                useSelected: t('select-association'),
              }}
              defaultSelected={data.path?.uri}
              handleFollowUp={(value) =>
                handleUpdate(
                  'path',
                  value
                    ? {
                        id: value.uri,
                        label: value.label,
                        uri: value.uri,
                      }
                    : undefined
                )
              }
              buttonIcon={true}
              applicationProfile={applicationProfile}
            />
          }
          handleRemoval={() => handleUpdate('path', undefined)}
          items={data.path ? [data.path] : []}
          label={t('target-association')}
        />

        <InlineListBlock
          addNewComponent={
            <ClassModal
              modelId={modelId}
              mode={'select'}
              modalButtonLabel={t('select-class')}
              handleFollowUp={handleClassUpdate}
              initialSelected={data.classType ?? ''}
              applicationProfile
              resourceRestriction
            />
          }
          handleRemoval={() => handleUpdate('classType', undefined)}
          items={
            data.classType
              ? [{ id: data.classType, label: data.classType }]
              : []
          }
          label={t('association-targets-class', { ns: 'common' })}
        />

        <TextInput
          labelText={t('minimum-amount')}
          optionalText={t('optional')}
          defaultValue={data.minCount?.toString() ?? ''}
          onChange={(e) => handleUpdate('minCount', e?.toString() ?? '')}
        />

        <TextInput
          labelText={t('maximum-amount')}
          optionalText={t('optional')}
          defaultValue={data.maxCount?.toString() ?? ''}
          onChange={(e) => handleUpdate('maxCount', e?.toString() ?? '')}
        />
      </>
    );
  }

  return <></>;
}
