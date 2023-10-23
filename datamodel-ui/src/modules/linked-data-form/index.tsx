import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, Text } from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import TerminologyModal from '../terminology-modal';
import {
  ExternalNamespace,
  InternalNamespace,
  ModelCodeList,
  ModelTerminology,
  ModelType,
} from '@app/common/interfaces/model.interface';
import {
  setHasChanges,
  useUpdateModelMutation,
} from '@app/common/components/model/model.slice';
import generatePayloadUpdate from '../model/generate-payload';
import CodeListModal from '../code-list-modal';
import LinkedModel from '../linked-model';
import LinkedItem from './linked-item';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import { useStoreDispatch } from '@app/store';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { HeaderRow, StyledSpinner } from '@app/common/components/header';

export default function LinkedDataForm({
  hasCodelist,
  model,
  handleReturn,
}: {
  hasCodelist: boolean;
  model: ModelType;
  handleReturn: () => void;
}) {
  const { t } = useTranslation('admin');
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const dispatch = useStoreDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [updateModel, result] = useUpdateModelMutation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [userPosted, setUserPosted] = useState(false);
  const [data, setData] = useState<{
    codeLists: ModelCodeList[];
    externalNamespaces: ExternalNamespace[];
    internalNamespaces: InternalNamespace[];
    terminologies: ModelTerminology[];
  }>({
    codeLists: model.codeLists ?? [],
    externalNamespaces: model.externalNamespaces ?? [],
    internalNamespaces: model.internalNamespaces ?? [],
    terminologies: model.terminologies ?? [],
  });

  const handleUpdate = (value: typeof data) => {
    enableConfirmation();
    dispatch(setHasChanges(true));
    setData(value);
  };

  const handleSubmit = () => {
    setUserPosted(true);
    disableConfirmation();
    dispatch(setHasChanges(false));

    const payload = generatePayloadUpdate({
      ...model,
      codeLists: data.codeLists,
      externalNamespaces: data.externalNamespaces,
      internalNamespaces: data.internalNamespaces,
      terminologies: data.terminologies,
    });

    updateModel({
      payload: payload,
      prefix: model.prefix,
      isApplicationProfile: model.type === 'PROFILE',
    });
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (result.isSuccess) {
      setUserPosted(false);
      handleReturn();
      dispatch(setNotification('LINK_EDIT'));
    }
  }, [result, dispatch, handleReturn]);

  return (
    <>
      <StaticHeader ref={ref}>
        <HeaderRow>
          <Text variant="bold">{t('links', { ns: 'common' })}</Text>

          <div
            style={{
              display: 'flex',
              gap: '15px',
            }}
          >
            <Button onClick={() => handleSubmit()} id="submit-button">
              {userPosted ? (
                <div role="alert">
                  <StyledSpinner
                    variant="small"
                    text={t('saving')}
                    textAlign="right"
                  />
                </div>
              ) : (
                <>{t('save')}</>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                handleReturn();
                dispatch(setHasChanges(false));
              }}
              id="cancel-button"
            >
              {t('cancel-variant')}
            </Button>
          </div>
        </HeaderRow>
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
                  name: { [key: string]: string };
                  namespace: string;
                  prefix: string;
                }) =>
                  handleUpdate({
                    ...data,
                    externalNamespaces: [...data.externalNamespaces, external],
                  })
                }
                currentModel={model.prefix}
                languages={model.languages}
              />
            </div>
          }
        >
          <div>
            {data.internalNamespaces.map((n) => (
              <LinkedItem
                key={`internal-namespace-item-${n.prefix}`}
                itemData={{
                  prefix: n.prefix,
                  name: n.name,
                  namespace: n.namespace,
                  type: 'datamodel-internal',
                }}
                handleRemove={(id) =>
                  handleUpdate({
                    ...data,
                    internalNamespaces: data.internalNamespaces.filter(
                      (n) => n.namespace !== id
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
                    console.info('set data', name);
                    const updated = data.externalNamespaces.map((ext) => {
                      if (ext.prefix === n.prefix) {
                        return {
                          ...ext,
                          name: { ...ext.name, ...name },
                        };
                      }
                      return ext;
                    });
                    console.info('updated', updated);
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
                languages={model.languages}
              />
            ))}
          </div>
        </BasicBlock>
      </DrawerContent>
    </>
  );
}
