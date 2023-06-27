import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, ExternalLink, Text, TextInput } from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { LinkedItemWrapper } from './linked-data-form.styles';
import {
  ModelTerminology,
  ModelType,
} from '@app/common/interfaces/model.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { usePostModelMutation } from '@app/common/components/model/model.slice';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import {
  getIsPartOfWithId,
  getOrganizationsWithId,
} from '@app/common/utils/get-value';
import generatePayload from '../model/generate-payload';

export interface LinkedDataFormData {
  terminologies: ModelTerminology[];
  datamodels: [];
  codelists: [];
}

export default function LinkedDataForm({
  hasCodelist,
  model,
  handleReturn,
}: {
  hasCodelist: boolean;
  model: ModelType;
  handleReturn: (data?: LinkedDataFormData) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const ref = useRef<HTMLDivElement>(null);
  const [postModel, result] = usePostModelMutation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [data, setData] = useState<ModelFormType>({
    contact: '',
    languages:
      ['fi', 'sv', 'en'].map((lang) => ({
        labelText: translateLanguage(lang, t),
        uniqueItemId: lang,
        title:
          Object.entries(model.label).find((t) => t[0] === lang)?.[1] ?? '',
        description:
          Object.entries(model.description).find((d) => d[0] === lang)?.[1] ??
          '',
        selected: model.languages.includes(lang),
      })) ?? [],
    organizations: getOrganizationsWithId(model, i18n.language) ?? [],
    prefix: model.prefix ?? '',
    serviceCategories: getIsPartOfWithId(model, i18n.language) ?? [],
    status: model.status ?? 'DRAFT',
    type: model.type ?? 'PROFILE',
    terminologies: model.terminologies ?? [],
  });

  const handleSubmit = () => {
    const payload = generatePayload(data);

    postModel({ payload: payload, prefix: data.prefix });
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (result.isSuccess) {
      handleReturn();
    }
  }, [result, handleReturn]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div
          style={{
            display: 'flex',
            alignItems: 'space-between',
          }}
        >
          <Text variant="bold">{t('links', { ns: 'common' })}</Text>

          <div
            style={{
              display: 'flex',
              gap: '15px',
            }}
          >
            <Button onClick={() => handleSubmit()}>{t('save')}</Button>
            <Button variant="secondary" onClick={() => handleReturn()}>
              {t('cancel-variant')}
            </Button>
          </div>
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        <BasicBlock
          title={
            <>
              {t('linked-terminologies', { ns: 'common' })}
              <Text smallScreen style={{ color: '#5F686D' }}>
                {' '}
                ({t('optional')})
              </Text>
            </>
          }
        >
          <div>
            {data.terminologies.map((t) => (
              <LinkedItem
                key={`terminology-item-${t.uri}`}
                itemData={t}
                type="terminology"
              />
            ))}
          </div>
        </BasicBlock>

        {hasCodelist ? (
          <BasicBlock
            title={
              <>
                {t('linked-codelists')}
                <Text smallScreen style={{ color: '#5F686D' }}>
                  {' '}
                  ({t('optional')})
                </Text>
              </>
            }
            extra={
              <div>
                <Button variant="secondary" icon="plus">
                  {/* No need for translation. Just a placeholder */}
                  Lisää koodisto
                </Button>
              </div>
            }
          >
            <div></div>
          </BasicBlock>
        ) : (
          <></>
        )}

        <BasicBlock
          title={
            <>
              {t('linked-terminologies', { ns: 'common' })}
              <Text smallScreen style={{ color: '#5F686D' }}>
                {' '}
                ({t('optional')})
              </Text>
            </>
          }
          extra={
            <div>
              <Button variant="secondary" icon="plus">
                {/* No need for translation. Just a placeholder */}
                Lisää tietomalli
              </Button>
            </div>
          }
        >
          <div></div>
        </BasicBlock>
      </DrawerContent>
    </>
  );

  function LinkedItem({
    itemData,
    type,
  }: {
    itemData: {
      label: { [key: string]: string };
      identifier?: string;
      uri: string;
    };
    type: 'terminology' | 'datamodel';
  }) {
    const handleItemRemove = () => {
      if (type === 'terminology') {
        setData((data) => ({
          ...data,
          terminologies: data.terminologies.filter(
            (t) => t.uri !== itemData.uri
          ),
        }));
      }
    };

    return (
      <LinkedItemWrapper>
        <div className="item-content">
          {renderTerminologyContent()}
          {renderDatamodelContent()}
        </div>

        <div>
          <Button
            variant="secondaryNoBorder"
            icon="remove"
            onClick={() => handleItemRemove()}
          >
            {t('remove')}
          </Button>
        </div>
      </LinkedItemWrapper>
    );

    function renderTerminologyContent() {
      if (type !== 'terminology') {
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
            labelNewWindow="Avaa uuteen ikkunaan"
            href={itemData.uri}
          >
            {label !== '' ? label : itemData.uri}
          </ExternalLink>
          <Text smallScreen>{itemData.uri}</Text>
        </>
      );
    }

    function renderDatamodelContent() {
      if (type !== 'datamodel') {
        return <></>;
      }

      return (
        <>
          <BasicBlock title="Tietomallin nimi">
            {itemData.uri.startsWith('http://uri.suomi.fi') ||
            itemData.uri.includes('http://uri.suomi.fi') ? (
              itemData.label
            ) : (
              <TextInput
                labelText=""
                labelMode="hidden"
                defaultValue={getLanguageVersion({
                  data: itemData.label,
                  lang: i18n.language,
                  appendLocale: true,
                })}
              />
            )}
          </BasicBlock>

          <BasicBlock title="Etuliite (tunnus tässä palvelussa)">
            {itemData.identifier ??
              itemData.uri.split('/').pop()?.replace('#', '') ??
              itemData.uri}
          </BasicBlock>

          <div className="datamodel-link">
            <ExternalLink
              labelNewWindow="Avaa uuteen ikkunaan"
              href={itemData.uri}
            >
              {itemData.uri}
            </ExternalLink>
          </div>
        </>
      );
    }
  }
}
