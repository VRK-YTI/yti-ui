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
import { usePostModelMutation } from '@app/common/components/model/model.slice';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import {
  getIsPartOfWithId,
  getOrganizationsWithId,
} from '@app/common/utils/get-value';
import generatePayload from '../model/generate-payload';
import LinkedModel from '../linked-model';
import LinkedItem from './linked-item';

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
    externalNamespaces: model.externalNamespaces ?? [],
    internalNamespaces: model.internalNamespaces ?? [],
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
          extra={
            <div>
              <TerminologyModal
                setFormData={(terminologies) =>
                  setData({
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
                  setData((data) => ({
                    ...data,
                    terminologies: data.terminologies.filter(
                      (t) => t.uri !== id
                    ),
                  }))
                }
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
              <LinkedModel
                initialData={{
                  internalNamespaces: data.internalNamespaces,
                }}
                setInternalData={(internal) =>
                  setData({
                    ...data,
                    internalNamespaces: internal,
                  })
                }
                setExternalData={(external: {
                  name: string;
                  namespace: string;
                  prefix: string;
                }) =>
                  setData({
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
                key={`internal-namespace-item-${n}`}
                itemData={{
                  uri: n,
                  type: 'datamodel-internal',
                }}
                handleRemove={(id) =>
                  setData((data) => ({
                    ...data,
                    internalNamespaces: data.internalNamespaces.filter(
                      (n) => n !== id
                    ),
                  }))
                }
              />
            ))}
            {data.externalNamespaces.map((n) => (
              <LinkedItem
                key={`external-namespace-item-${n.prefix}`}
                itemData={{
                  ...n,
                  type: 'datamodel-external',
                  setData: (name) =>
                    setData((data) => {
                      const updated = data.externalNamespaces.map((ext) => {
                        if (ext.prefix === n.prefix) {
                          return {
                            ...ext,
                            name: name,
                          };
                        }
                        return ext;
                      });

                      return {
                        ...data,
                        externalNamespaces: updated,
                      };
                    }),
                }}
                handleRemove={(id) =>
                  setData((data) => ({
                    ...data,
                    externalNamespaces: data.externalNamespaces.filter(
                      (n) => n.namespace !== id
                    ),
                  }))
                }
              />
            ))}
          </div>
        </BasicBlock>
      </DrawerContent>
    </>
  );

  // function LinkedItem({
  //   itemData,
  // }: {
  //   itemData:
  //   | {
  //     label: { [key: string]: string };
  //     identifier?: string;
  //     uri: string;
  //     type: 'terminology';
  //   }
  //   | {
  //     uri: string;
  //     type: 'datamodel-internal';
  //   }
  //   | {
  //     name: string;
  //     namespace: string;
  //     prefix: string;
  //     type: 'datamodel-external';
  //   };
  // }) {
  //   const handleItemRemove = () => {
  //     if (itemData.type === 'terminology') {
  //       setData((data) => ({
  //         ...data,
  //         terminologies: data.terminologies.filter(
  //           (t) => t.uri !== itemData.uri
  //         ),
  //       }));
  //       return;
  //     } else if (itemData.type === 'datamodel-internal') {
  //       setData((data) => ({
  //         ...data,
  //         internalNamespaces: data.internalNamespaces.filter(
  //           (n) => n !== itemData.uri
  //         ),
  //       }));
  //     } else {
  //       setData((data) => ({
  //         ...data,
  //         externalNamespaces: data.externalNamespaces.filter(
  //           (n) => n.namespace !== itemData.namespace
  //         ),
  //       }));
  //     }
  //   };

  //   return (
  //     <LinkedItemWrapper>
  //       <div className="item-content">
  //         {renderTerminologyContent()}
  //         {renderDatamodelContent()}
  //       </div>

  //       <div>
  //         <Button
  //           variant="secondaryNoBorder"
  //           icon="remove"
  //           onClick={() => handleItemRemove()}
  //         >
  //           {t('remove')}
  //         </Button>
  //       </div>
  //     </LinkedItemWrapper>
  //   );

  //   function renderTerminologyContent() {
  //     if (itemData.type !== 'terminology') {
  //       return <></>;
  //     }

  //     const label = getLanguageVersion({
  //       data: itemData.label,
  //       lang: i18n.language,
  //       appendLocale: true,
  //     });

  //     return (
  //       <>
  //         <ExternalLink
  //           labelNewWindow="Avaa uuteen ikkunaan"
  //           href={itemData.uri}
  //         >
  //           {label !== '' ? label : itemData.uri}
  //         </ExternalLink>
  //         <Text smallScreen>{itemData.uri}</Text>
  //       </>
  //     );
  //   }

  //   function renderDatamodelContent() {
  //     if (itemData.type === 'datamodel-internal') {
  //       return (
  //         <>
  //           <BasicBlock title="Tietomallin nimi">Tietomallin nimi</BasicBlock>

  //           <BasicBlock title="Etuliite (tunnus tässä palvelussa)">
  //             {itemData.uri.split('/').pop()?.replace('#', '') ?? itemData.uri}
  //           </BasicBlock>

  //           <div className="datamodel-link">
  //             <ExternalLink
  //               labelNewWindow="Avaa uuteen ikkunaan"
  //               href={itemData.uri}
  //             >
  //               {itemData.uri}
  //             </ExternalLink>
  //           </div>
  //         </>
  //       );
  //     }

  //     if (itemData.type === 'datamodel-external') {
  //       return (
  //         <>
  //           <TextInput
  //             labelText="Tietomallin nimi"
  //             defaultValue={itemData.name}
  //             onChange={(e) => {
  //               const updated = data.externalNamespaces.map((n) => {
  //                 if (n.namespace === itemData.namespace) {
  //                   return {
  //                     ...n,
  //                     name: e?.toString() ?? '',
  //                   };
  //                 }
  //                 return n;
  //               });

  //               setData({
  //                 ...data,
  //                 externalNamespaces: updated,
  //               });
  //             }}
  //           />

  //           <BasicBlock title="Etuliite (tunnus tässä palvelussa)">
  //             {itemData.prefix}
  //           </BasicBlock>

  //           <div className="datamodel-link">
  //             <ExternalLink
  //               labelNewWindow="Avaa uuteen ikkunaan"
  //               href={itemData.namespace}
  //             >
  //               {itemData.namespace}
  //             </ExternalLink>
  //           </div>
  //         </>
  //       );
  //     }

  //     return <></>;
  //   }
  // }
}
