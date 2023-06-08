import {
  Button,
  ExternalLink,
  IconRemove,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { LinkedItemWrapper } from './linked-data-form.styles';
import { useTranslation } from 'next-i18next';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { BasicBlock } from 'yti-common-ui/block';

interface LinkedItemProps {
  itemData:
    | {
        label: { [key: string]: string };
        identifier?: string;
        uri: string;
        type: 'terminology';
      }
    | {
        name: string;
        uri: string;
        type: 'datamodel-internal';
      }
    | {
        name: string;
        namespace: string;
        prefix: string;
        type: 'datamodel-external';
        setData: (value: string) => void;
      }
    | {
        prefLabel: { [key: string]: string };
        type: 'codelist';
        id: string;
      };
  handleRemove: (id: string) => void;
}

export default function LinkedItem({
  itemData,
  handleRemove,
}: LinkedItemProps) {
  const { t, i18n } = useTranslation('admin');

  const getId = () => {
    return 'uri' in itemData
      ? itemData.uri
      : 'id' in itemData
      ? itemData.id
      : itemData.namespace;
  };

  return (
    <LinkedItemWrapper>
      <div className="item-content">
        {renderTerminologyContent()}
        {renderDatamodelContent()}
        {renderCodeListContent()}
      </div>

      <div>
        <Button
          variant="secondaryNoBorder"
          icon={<IconRemove />}
          onClick={() => handleRemove(getId())}
        >
          {t('remove')}
        </Button>
      </div>
    </LinkedItemWrapper>
  );

  function renderTerminologyContent() {
    if (itemData.type !== 'terminology') {
      return <></>;
    }

    const label = getLanguageVersion({
      data: itemData.label,
      lang: i18n.language,
      appendLocale: true,
    });

    return (
      <>
        <ExternalLink
          labelNewWindow={t('site-open-link-new-window', { ns: 'common' })}
          href={itemData.uri}
        >
          {label !== '' ? label : itemData.uri}
        </ExternalLink>
        <Text smallScreen>{itemData.uri}</Text>
      </>
    );
  }

  function renderDatamodelContent() {
    if (itemData.type === 'datamodel-internal') {
      return (
        <>
          <BasicBlock title={t('data-model-name')}>
            {itemData.name !== '' ? itemData.name : itemData.uri}
          </BasicBlock>

          <BasicBlock title={t('prefix-in-this-service')}>
            {itemData.uri.split('/').pop()?.replace('#', '') ?? itemData.uri}
          </BasicBlock>

          <div className="datamodel-link">
            <ExternalLink
              labelNewWindow={t('site-open-link-new-window', { ns: 'common' })}
              href={itemData.uri}
            >
              {itemData.uri}
            </ExternalLink>
          </div>
        </>
      );
    }

    if (itemData.type === 'datamodel-external') {
      return (
        <>
          <TextInput
            labelText={t('data-model-name')}
            defaultValue={itemData.name}
            onChange={(e) => itemData.setData(e?.toString() ?? '')}
          />

          <BasicBlock title={t('prefix-in-this-service')}>
            {itemData.prefix}
          </BasicBlock>

          <div className="datamodel-link">
            <ExternalLink
              labelNewWindow={t('site-open-link-new-window', { ns: 'common' })}
              href={itemData.namespace}
            >
              {itemData.namespace}
            </ExternalLink>
          </div>
        </>
      );
    }

    return <></>;
  }

  function renderCodeListContent() {
    if (itemData.type !== 'codelist') {
      return <></>;
    }

    const label = getLanguageVersion({
      data: itemData.prefLabel,
      lang: i18n.language,
      appendLocale: true,
    });

    return (
      <>
        <ExternalLink
          labelNewWindow={t('site-open-link-new-window', { ns: 'common' })}
          href={itemData.id ?? ''}
        >
          {label !== '' ? label : itemData.id}
        </ExternalLink>
        <Text smallScreen>{itemData.id}</Text>
      </>
    );
  }
}
