import { useGetDatatypesQuery } from '@app/common/components/datatypes/datatypes.slice';
import InlineListBlock from '@app/common/components/inline-list-block';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import {
  DEFAULT_DATA_TYPE,
  ResourceFormType,
} from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import ClassModal from '@app/modules/class-modal';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { SingleSelect, SingleSelectData, Tooltip } from 'suomifi-ui-components';
import ResourceModal from '../../resource-modal';
import { UriData } from '@app/common/interfaces/uri.interface';

export default function RangeAndDomain({
  applicationProfile,
  data,
  modelId,
  handleUpdate,
}: {
  applicationProfile?: boolean;
  data: ResourceFormType;
  modelId: string;
  handleUpdate: (value: ResourceFormType) => void;
}) {
  const { t } = useTranslation('admin');
  const { data: dataTypesResult, isSuccess: isDataTypesSuccess } =
    useGetDatatypesQuery(void null, {
      skip: data.type !== ResourceType.ATTRIBUTE && applicationProfile,
    });

  const attributeRanges: SingleSelectData[] = useMemo(() => {
    if (!isDataTypesSuccess) {
      return [];
    }

    return dataTypesResult.map((result) => ({
      labelText: result.curie ?? result.uri,
      uniqueItemId: result.uri,
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
        uri: value.id,
        curie: value.curie,
        label: value.label,
      },
    });
  };

  const handlePathFollowUP = (value?: UriData) => {
    if (!value) {
      handleUpdate({ ...data, path: value });
      return;
    }

    handleUpdate({
      ...data,
      path: value,
    });
  };

  const handleRangeFollowUp = (value?: InternalClass) => {
    if (data.type === ResourceType.ATTRIBUTE) {
      return;
    }

    if (!value) {
      handleUpdate({ ...data, range: value });
      return;
    }

    handleUpdate({
      ...data,
      range: {
        uri: value.id,
        curie: value.curie,
        label: value.label,
      },
    });
  };

  const handleDomainOrRangeRemoval = (type: 'domain' | 'range') => {
    handleUpdate({
      ...data,
      [type]: undefined,
    });
  };

  if (applicationProfile && data.type === ResourceType.ASSOCIATION) {
    return <></>;
  }

  if (data.type === ResourceType.ATTRIBUTE) {
    return (
      <>
        {applicationProfile && (
          <InlineListBlock
            addNewComponent={
              <ResourceModal
                modelId={modelId}
                type={data.type}
                buttonTranslations={{
                  useSelected: t('select-attribute'),
                  openButton: t('select-attribute'),
                }}
                handleFollowUp={handlePathFollowUP}
                applicationProfile={applicationProfile}
                defaultSelected={data.path?.uri}
                hiddenResources={[data.uri]}
              />
            }
            deleteDisabled={true}
            handleRemoval={() => null}
            items={data.path ? [data.path] : []}
            label={`${t('target-attribute')} (owl:DatatypeProperty)`}
            tooltip={{
              text: t('tooltip.target-attribute', { ns: 'common' }),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
          />
        )}
        <SingleSelect
          labelText={`${t('data-type', { ns: 'common' })} ${
            applicationProfile ? '(sh:datatype)' : '(rdfs:range)'
          }`}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.data-type', { ns: 'common' })}
            </Tooltip>
          }
          itemAdditionHelpText=""
          ariaOptionsAvailableText={t('available-ranges') as string}
          defaultSelectedItem={attributeRanges.find(
            (value) => value.uniqueItemId === DEFAULT_DATA_TYPE.uri
          )}
          selectedItem={attributeRanges.find((value) => {
            if (!applicationProfile && data.range != undefined) {
              return value.uniqueItemId == data.range.uri;
            } else if (applicationProfile && data.dataType) {
              return value.uniqueItemId == data.dataType.uri;
            } else {
              return value.uniqueItemId == DEFAULT_DATA_TYPE.uri;
            }
          })}
          clearButtonLabel={t('clear-selection')}
          onItemSelect={(e) =>
            e != undefined &&
            handleUpdate({
              ...data,
              ...(applicationProfile
                ? { dataType: { uri: e, curie: e, label: { en: e } } }
                : { range: { uri: e, curie: e, label: { en: e } } }),
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
                initialSelected={data.domain?.uri}
              />
            }
            tooltip={{
              text: t('tooltip.class', { ns: 'common' }),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
            handleRemoval={() => handleDomainOrRangeRemoval('domain')}
            items={data.domain ? [data.domain] : []}
            label={`${t('class', { ns: 'common' })} (rdfs:domain)`}
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
            initialSelected={data.domain?.uri}
          />
        }
        tooltip={{
          text: t('tooltip.associations-source', { ns: 'common' }),
          ariaCloseButtonLabelText: '',
          ariaToggleButtonLabelText: '',
        }}
        handleRemoval={() => handleDomainOrRangeRemoval('domain')}
        items={data.domain ? [data.domain] : []}
        label={`${t('source-class')} (rdfs:domain)`}
        optionalText={t('optional')}
      />

      <InlineListBlock
        addNewComponent={
          <ClassModal
            handleFollowUp={handleRangeFollowUp}
            modelId={modelId}
            modalButtonLabel={t('select-class')}
            mode="select"
            initialSelected={data.range?.uri}
          />
        }
        handleRemoval={() => handleDomainOrRangeRemoval('range')}
        items={data.range ? [data.range] : []}
        label={`${t('target-class')} (rdfs:range)`}
        optionalText={t('optional')}
        tooltip={{
          text: t('tooltip.associations-target', { ns: 'common' }),
          ariaCloseButtonLabelText: '',
          ariaToggleButtonLabelText: '',
        }}
      />
    </>
  );
}
