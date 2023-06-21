import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, Text } from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import TerminologyModal from '../terminology-modal';
import {
  ModelTerminology,
  ModelType,
} from '@app/common/interfaces/model.interface';
import {
  setHasChanges,
  usePostModelMutation,
} from '@app/common/components/model/model.slice';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import {
  getIsPartOfWithId,
  getOrganizationsWithId,
} from '@app/common/utils/get-value';
import generatePayload from '../model/generate-payload';
import CodeListModal from '../code-list-modal';
import LinkedModel from '../linked-model';
import LinkedItem from './linked-item';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import { useStoreDispatch } from '@app/store';

export interface LinkedDataFormData {
  terminologies: ModelTerminology[];
  datamodels: [];
  codelists: [];
}

interface DataInterface extends Omit<ModelFormType, 'internalNamespaces'> {
  internalNamespaces: {
    name: string;
    uri: string;
  }[];
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
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const dispatch = useStoreDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [postModel, result] = usePostModelMutation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [data, setData] = useState<DataInterface>({
    contact: '',
    externalNamespaces: model.externalNamespaces ?? [],
    internalNamespaces:
      model.internalNamespaces.map((n) => ({
        name: '',
        uri: n,
      })) ?? [],
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
    codeLists: model.codeLists ?? [],
  });

  const handleUpdate = (data: DataInterface) => {
    enableConfirmation();
    dispatch(setHasChanges(true));
    setData(data);
  };

  const handleSubmit = () => {
    disableConfirmation();
    dispatch(setHasChanges(false));

    const internalNamespaces = data.internalNamespaces.map((n) => n.uri);
    const payload = generatePayload({ ...data, internalNamespaces });
    postModel({
      payload: payload,
      prefix: data.prefix,
      isApplicationProfile: data.type === 'PROFILE',
    });
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
            <Button
              variant="secondary"
              onClick={() => {
                handleReturn();
                dispatch(setHasChanges(false));
              }}
            >
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
          extra={
            <div>
              <TerminologyModal
                setFormData={(terminologies) =>
                  handleUpdate({
                    ...data,
                    terminologies: terminologies,
                  })
                }
                addedTerminologies={data.terminologies}
              />
            </div>
          }
        >
          <div>
            {data.terminologies.map((t) => (
              <LinkedItem
                key={`terminology-item-${t.uri}`}
                itemData={{
                  ...t,
                  type: 'terminology',
                }}
                handleRemove={(id) =>
                  setData({
                    ...data,
                    terminologies: data.terminologies.filter(
                      (t) => t.uri !== id
                    ),
                  })
                }
              />
            ))}
          </div>
        </BasicBlock>

        {hasCodelist ? (
          <BasicBlock
            title={
              <>
                {t('linked-codelists', { ns: 'common' })}
                <Text smallScreen style={{ color: '#5F686D' }}>
                  {' '}
                  ({t('optional')})
                </Text>
              </>
            }
            extra={
              <div>
                <CodeListModal
                  initialData={data.codeLists}
                  setData={(codeLists) =>
                    handleUpdate({
                      ...data,
                      codeLists: codeLists,
                    })
                  }
                />
              </div>
            }
          >
            <div>
              {data.codeLists.map((c) => (
                <LinkedItem
                  key={`terminology-item-${c.id}`}
                  itemData={{
                    ...c,
                    type: 'codelist',
                  }}
                  handleRemove={(id) =>
                    handleUpdate({
                      ...data,
                      codeLists: data.codeLists.filter((t) => t.id !== id),
                    })
                  }
                />
              ))}
            </div>
          </BasicBlock>
        ) : (
          <></>
        )}

        <BasicBlock
          title={
            <>
              {t('linked-datamodels', { ns: 'common' })}
              <Text smallScreen style={{ color: '#5F686D' }}>
                {' '}
                ({t('optional')})
              </Text>
            </>
          }
          extra={
            <div>
              <LinkedModel
                initialData={{
                  internalNamespaces: data.internalNamespaces,
                }}
                setInternalData={(internal) =>
                  handleUpdate({
                    ...data,
                    internalNamespaces: internal,
                  })
                }
                setExternalData={(external: {
                  name: string;
                  namespace: string;
                  prefix: string;
                }) =>
                  handleUpdate({
                    ...data,
                    externalNamespaces: [...data.externalNamespaces, external],
                  })
                }
              />
            </div>
          }
        >
          <div>
            {data.internalNamespaces.map((n) => (
              <LinkedItem
                key={`internal-namespace-item-${n.uri}`}
                itemData={{
                  uri: n.uri,
                  name: n.name,
                  type: 'datamodel-internal',
                }}
                handleRemove={(id) =>
                  handleUpdate({
                    ...data,
                    internalNamespaces: data.internalNamespaces.filter(
                      (n) => n.uri !== id
                    ),
                  })
                }
              />
            ))}

            {data.externalNamespaces.map((n) => (
              <LinkedItem
                key={`external-namespace-item-${n.prefix}`}
                itemData={{
                  ...n,
                  type: 'datamodel-external',
                  setData: (name) => {
                    const updated = data.externalNamespaces.map((ext) => {
                      if (ext.prefix === n.prefix) {
                        return {
                          ...ext,
                          name: name,
                        };
                      }
                      return ext;
                    });

                    handleUpdate({
                      ...data,
                      externalNamespaces: updated,
                    });
                  },
                }}
                handleRemove={(id) =>
                  handleUpdate({
                    ...data,
                    externalNamespaces: data.externalNamespaces.filter(
                      (n) => n.namespace !== id
                    ),
                  })
                }
              />
            ))}
          </div>
        </BasicBlock>
      </DrawerContent>
    </>
  );
}
