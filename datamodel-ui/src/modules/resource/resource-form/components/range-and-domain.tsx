import { useGetDatatypesQuery } from '@app/common/components/datatypes/datatypes.slice';
import InlineListBlock from '@app/common/components/inline-list-block';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import ClassModal from '@app/modules/class-modal';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Button, SingleSelect, SingleSelectData } from 'suomifi-ui-components';

export default function RangeAndDomain({
  applicationProfile,
  data,
  modelId,
  type,
  handleUpdate,
}: {
  applicationProfile?: boolean;
  data: ResourceFormType;
  modelId: string;
  type: ResourceType;
  handleUpdate: (value: ResourceFormType) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const { data: dataTypesResult, isSuccess: isDataTypesSuccess } =
    useGetDatatypesQuery(void null, {
      skip: type !== ResourceType.ATTRIBUTE && applicationProfile,
    });

  const attributeRanges: SingleSelectData[] = useMemo(() => {
    if (!isDataTypesSuccess) {
      return [];
    }

    return dataTypesResult.map((result) => ({
      labelText: result,
      uniqueItemId: result,
    }));
  }, [dataTypesResult, isDataTypesSuccess]);

  const handleDomainFollowUp = (value?: InternalClass) => {
    if (!value) {
      handleUpdate({ ...data, domain: value });
      return;
    }

    handleUpdate({
      ...data,
      domain: {
        id: value.id,
        label: getLanguageVersion({
          data: value.label,
          lang: i18n.language,
          appendLocale: true,
        }),
      },
    });
  };

  const handleRangeFollowUp = (value?: InternalClass) => {
    if (type === ResourceType.ATTRIBUTE) {
      return;
    }

    if (!value) {
      handleUpdate({ ...data, range: value });
      return;
    }

    handleUpdate({
      ...data,
      range: {
        id: value.id,
        label: getLanguageVersion({
          data: value.label,
          lang: i18n.language,
          appendLocale: true,
        }),
      },
    });
  };

  const handleDomainOrRangeRemoval = (type: 'domain' | 'range') => {
    handleUpdate({
      ...data,
      [type]: undefined,
    });
  };

  if (applicationProfile && type === ResourceType.ASSOCIATION) {
    return <></>;
  }

  if (type === ResourceType.ATTRIBUTE) {
    return (
      <>
        {applicationProfile && (
          <InlineListBlock
            addNewComponent={
              <Button variant="secondary">{t('select-attribute')}</Button>
            }
            handleRemoval={() => null}
            items={data.path ? [data.path] : []}
            label={t('target-attribute')}
          />
        )}

        <SingleSelect
          labelText={t('range')}
          itemAdditionHelpText=""
          ariaOptionsAvailableText={t('available-ranges') as string}
          defaultSelectedItem={attributeRanges.find(
            (value) => value.uniqueItemId == '-1'
          )}
          selectedItem={attributeRanges.find((value) => {
            if (!applicationProfile && data.range != undefined) {
              return value.uniqueItemId == data.range.id;
            } else if (applicationProfile && data.dataType) {
              return value.uniqueItemId == data.dataType.id;
            } else {
              return value.uniqueItemId == 'rdfs:Literal';
            }
          })}
          clearButtonLabel={t('clear-selection')}
          onItemSelect={(e) =>
            e != undefined &&
            handleUpdate({
              ...data,
              ...(applicationProfile
                ? { dataType: { id: e, label: e } }
                : { range: { id: e, label: e } }),
            })
          }
          items={attributeRanges}
        />

        {!applicationProfile && (
          <InlineListBlock
            addNewComponent={
              <ClassModal
                handleFollowUp={handleDomainFollowUp}
                modelId={modelId}
                modalButtonLabel={t('select-class')}
                mode="select"
                initialSelected={data.domain?.id}
              />
            }
            handleRemoval={() => handleDomainOrRangeRemoval('domain')}
            items={data.domain ? [data.domain] : []}
            label={t('class')}
            optionalText={t('optional')}
          />
        )}
      </>
    );
  }

  return (
    <>
      <InlineListBlock
        addNewComponent={
          <ClassModal
            handleFollowUp={handleDomainFollowUp}
            modelId={modelId}
            modalButtonLabel={t('select-class')}
            mode="select"
            initialSelected={data.domain?.id}
          />
        }
        handleRemoval={() => handleDomainOrRangeRemoval('domain')}
        items={data.domain ? [data.domain] : []}
        label={t('source-class')}
        optionalText={t('optional')}
      />

      <InlineListBlock
        addNewComponent={
          <ClassModal
            handleFollowUp={handleRangeFollowUp}
            modelId={modelId}
            modalButtonLabel={t('select-class')}
            mode="select"
            initialSelected={data.range?.id}
          />
        }
        handleRemoval={() => handleDomainOrRangeRemoval('range')}
        items={data.range && typeof data.range !== 'string' ? [data.range] : []}
        label={t('target-class')}
        optionalText={t('optional')}
      />
    </>
  );
}
