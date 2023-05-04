import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, ExternalLink, Text, TextInput } from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { LinkedItemWrapper } from './linked-data-form.styles';
import TerminologyModal from '../terminology-modal';

export default function LinkedDataForm({
  hasCodelist,
  initialData,
  handleReturn,
}: {
  hasCodelist: boolean;
  initialData?: object;
  handleReturn: () => void;
}) {
  const { t } = useTranslation('admin');
  const ref = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div
          style={{
            display: 'flex',
            alignItems: 'space-between',
          }}
        >
          <Text variant="bold">Linkitykset</Text>

          <div
            style={{
              display: 'flex',
              gap: '15px',
            }}
          >
            <Button>{t('save')}</Button>
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
              Linkitetyt sanastot
              <Text smallScreen style={{ color: '#5F686D' }}>
                {' '}
                ({t('optional')})
              </Text>
            </>
          }
          extra={
            <div>
              <TerminologyModal
                setFormData={() => null}
                addedTerminologies={[]}
              />
            </div>
          }
        >
          <div>
            {[
              {
                label: 'Sanaston nimi',
                uri: 'http://uri.suomi.fi/datamodel/ns/df-lanu',
              },
            ].map((item) => (
              <LinkedItem
                key={`terminology-item-${item.uri}`}
                data={item}
                type="terminology"
              />
            ))}
          </div>
        </BasicBlock>

        {hasCodelist ? (
          <BasicBlock
            title={
              <>
                Linkitetyt koodistot
                <Text smallScreen style={{ color: '#5F686D' }}>
                  {' '}
                  ({t('optional')})
                </Text>
              </>
            }
            extra={
              <div>
                <Button variant="secondary" icon="plus">
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
              Linkitetyt tietomallit
              <Text smallScreen style={{ color: '#5F686D' }}>
                {' '}
                ({t('optional')})
              </Text>
            </>
          }
          extra={
            <div>
              <Button variant="secondary" icon="plus">
                Lisää tietomalli
              </Button>
            </div>
          }
        >
          <div>
            {[
              {
                label: 'Inspire',
                identifier: 'inspire',
                uri: 'http://inspire.ec.eropa.eu/featureconcept#',
              },
              {
                label: 'Henkilötietojen tietokomponentit',
                identifier: 'vrkhlo',
                uri: 'http://uri.suomi.fi/datamodel/ns/vrkhlo#',
              },
            ].map((item) => (
              <LinkedItem
                key={`terminology-item-${item.uri}`}
                data={item}
                type="datamodel"
              />
            ))}
          </div>
        </BasicBlock>
      </DrawerContent>
    </>
  );

  function LinkedItem({
    data,
    type,
  }: {
    data: {
      label: string;
      identifier?: string;
      uri: string;
    };
    type: 'terminology' | 'datamodel';
  }) {
    return (
      <LinkedItemWrapper>
        <div className="item-content">
          {renderTerminologyContent()}
          {renderDatamodelContent()}
        </div>

        <div>
          <Button variant="secondaryNoBorder" icon="remove">
            {t('remove')}
          </Button>
        </div>
      </LinkedItemWrapper>
    );

    function renderTerminologyContent() {
      if (type !== 'terminology') {
        return <></>;
      }

      return (
        <>
          <ExternalLink labelNewWindow="Avaa uuteen ikkunaan" href={data.uri}>
            {data.label}
          </ExternalLink>
          <Text smallScreen>{data.uri}</Text>
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
            {data.uri.startsWith('http://uri.suomi.fi') ||
            data.uri.includes('http://uri.suomi.fi') ? (
              data.label
            ) : (
              <TextInput
                labelText=""
                labelMode="hidden"
                defaultValue={data.label}
              />
            )}
          </BasicBlock>

          <BasicBlock title="Etuliite (tunnus tässä palvelussa)">
            {data.identifier ??
              data.uri.split('/').pop()?.replace('#', '') ??
              data.uri}
          </BasicBlock>

          <div className="datamodel-link">
            <ExternalLink labelNewWindow="Avaa uuteen ikkunaan" href={data.uri}>
              {data.uri}
            </ExternalLink>
          </div>
        </>
      );
    }
  }
}
