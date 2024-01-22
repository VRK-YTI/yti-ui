import InlineListBlock from '@app/common/components/inline-list-block';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import { TextInput, Tooltip } from 'suomifi-ui-components';
import ResourceModal from '../../resource-modal';
import ClassModal from '@app/modules/class-modal';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import styled from 'styled-components';

const TextInputWrapper = styled.div`
  > * {
    margin-bottom: 20px;
    width: 100%;

    .fi-text-input_input-element-container {
      width: 290px;
    }
  }
`;

export default function AssociationRestrictions({
  modelId,
  data,
  applicationProfile,
  handleUpdate,
}: {
  modelId: string;
  data: ResourceFormType;
  applicationProfile?: boolean;
  handleUpdate: (
    key: keyof ResourceFormType,
    value: ResourceFormType[typeof key]
  ) => void;
}) {
  const { t } = useTranslation('admin');

  if (data.type !== ResourceType.ASSOCIATION) {
    return <></>;
  }

  if (applicationProfile) {
    return (
      <>
        <InlineListBlock
          addNewComponent={
            <ResourceModal
              modelId={modelId}
              type={data.type}
              buttonTranslations={{
                useSelected: t('select-association'),
              }}
              defaultSelected={data.path?.uri}
              handleFollowUp={(value) =>
                handleUpdate(
                  'path',
                  value
                    ? {
                        curie: value.curie,
                        label: value.label,
                        uri: value.uri,
                      }
                    : undefined
                )
              }
              buttonIcon={true}
              applicationProfile={applicationProfile}
              hiddenResources={[data.uri]}
            />
          }
          deleteDisabled={true}
          handleRemoval={() => null}
          items={data.path ? [data.path] : []}
          label={`${t('target-association')} (sh:path)`}
          tooltip={{
            text: t('tooltip.target-association', { ns: 'common' }),
            ariaCloseButtonLabelText: '',
            ariaToggleButtonLabelText: '',
          }}
        />

        <InlineListBlock
          addNewComponent={
            <ClassModal
              modelId={modelId}
              mode={'select'}
              modalButtonLabel={t('select-class')}
              handleFollowUp={(value) =>
                handleUpdate(
                  'classType',
                  value
                    ? {
                        curie: value.curie,
                        label: value.label,
                        uri: value.id,
                      }
                    : undefined
                )
              }
              initialSelected={data.classType?.uri}
              applicationProfile
            />
          }
          handleRemoval={() => handleUpdate('classType', undefined)}
          items={data.classType ? [data.classType] : []}
          label={`${t('association-targets-class', {
            ns: 'common',
          })} (sh:class)`}
          tooltip={{
            text: t('tooltip.association-targets-class', { ns: 'common' }),
            ariaCloseButtonLabelText: '',
            ariaToggleButtonLabelText: '',
          }}
          optionalText={t('optional')}
        />

        <TextInputWrapper>
          <TextInput
            labelText={`${t('minimum-count', { ns: 'common' })} (sh:minCount)`}
            optionalText={t('optional')}
            tooltipComponent={
              <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
                {t('tooltip.minimum-amount', { ns: 'common' })}
              </Tooltip>
            }
            defaultValue={data.minCount?.toString() ?? ''}
            onChange={(e) => handleUpdate('minCount', e?.toString() ?? '')}
            maxLength={TEXT_INPUT_MAX}
          />

          <TextInput
            labelText={`${t('maximum-count', { ns: 'common' })} (sh:maxCount)`}
            optionalText={t('optional')}
            tooltipComponent={
              <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
                {t('tooltip.maximum-amount', { ns: 'common' })}
              </Tooltip>
            }
            defaultValue={data.maxCount?.toString() ?? ''}
            onChange={(e) => handleUpdate('maxCount', e?.toString() ?? '')}
            maxLength={TEXT_INPUT_MAX}
          />
        </TextInputWrapper>
      </>
    );
  }

  return <></>;
}
