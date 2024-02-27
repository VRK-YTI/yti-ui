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
import { compareLocales } from '@app/common/utils/compare-locals';

interface LinkedItemProps {
  itemData:
    | {
        label: { [key: string]: string };
        identifier?: string;
        uri: string;
        type: 'terminology';
      }
    | {
        name: { [key: string]: string };
        namespace: string;
        prefix: string;
        type: 'datamodel-internal';
      }
    | {
        name: { [key: string]: string };
        namespace: string;
        prefix: string;
        type: 'datamodel-external';
        setData: (value: { [key: string]: string }) => void;
      }
    | {
        prefLabel: { [key: string]: string };
        type: 'codelist';
        id: string;
      };
  handleRemove: (id: string) => void;
  languages?: string[];
  isError?: boolean;
}

export default function LinkedItem({
  itemData,
  handleRemove,
  languages,
  isError,
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
          id="remove-linked-item-button"
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
    if (
      itemData.type === 'datamodel-internal' ||
      itemData.type === 'datamodel-external'
    ) {
      return (
        <>
          {itemData.type == 'datamodel-internal' && (
            <BasicBlock title={t('data-model-name')}>
              {getLanguageVersion({
                data: itemData.name,
                lang: i18n.language,
                appendLocale: true,
              })}
            </BasicBlock>
          )}
          {itemData.type == 'datamodel-external' &&
            Array.from(languages ?? [])
              .sort((a, b) => compareLocales(a, b))
              ?.map((lang) => (
                <TextInput
                  key={`external-name-${lang}`}
                  labelText={`${t('data-model-name')}, ${lang}`}
                  defaultValue={itemData.name[lang]}
                  onChange={(e) => {
                    itemData.setData({ [lang]: e?.toString() ?? '' });
                  }}
                  status={isError ? 'error' : 'default'}
                />
              ))}
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
