import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, ExternalLink, Text, Tooltip } from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import {
  LinkedItem,
  LinkedWrapper,
  LinkExtraInfo,
} from './linked-data-view.styles';
import { TooltipWrapper } from '../model/model.styles';
import LinkedDataForm from '../linked-data-form';
import HasPermission from '@app/common/utils/has-permission';

export default function LinkedDataView({
  isApplicationProfile,
}: {
  isApplicationProfile: boolean;
}) {
  const { t } = useTranslation('common');
  const ref = useRef<HTMLDivElement>(null);
  const hasPermission = HasPermission({
    actions: ['ADMIN_DATA_MODEL'],
  });
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [renderForm, setRenderForm] = useState(false);

  const data = {
    terminologies: [
      {
        label: 'Sanaston nimi',
        uri: 'uri.suomi.fi/label-1',
      },
    ],
    datamodels: [
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
    ],
    codelists: [],
  };

  const handleShowForm = () => {
    setRenderForm(true);
    setShowTooltip(false);
  };

  const handleFormReturn = () => {
    setRenderForm(false);
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  if (renderForm) {
    return (
      <LinkedDataForm
        hasCodelist={isApplicationProfile}
        handleReturn={handleFormReturn}
      />
    );
  }

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

          {hasPermission && (
            <div>
              <Button
                variant="secondary"
                iconRight="menu"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                {t('actions')}
              </Button>
              <TooltipWrapper>
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                  open={showTooltip}
                  onCloseButtonClick={() => setShowTooltip(false)}
                >
                  <Button
                    variant="secondaryNoBorder"
                    onClick={() => handleShowForm()}
                  >
                    {t('edit', { ns: 'admin' })}
                  </Button>
                </Tooltip>
              </TooltipWrapper>
            </div>
          )}
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        <BasicBlock title="Linkitetyt sanastot">
          {data.terminologies && data.terminologies.length > 0 ? (
            <LinkedWrapper>
              {data.terminologies.map((t, idx) => (
                <LinkedItem key={`linked-terminology-${idx}`}>
                  <ExternalLink labelNewWindow={'avaa uuteen'} href={t.uri}>
                    {t.label}
                  </ExternalLink>
                </LinkedItem>
              ))}
            </LinkedWrapper>
          ) : (
            <>Ei linkitettyjä sanastoja.</>
          )}
        </BasicBlock>

        {isApplicationProfile ? (
          <BasicBlock title="Koodistot">
            {data.codelists && data.codelists.length > 0 ? (
              <LinkedWrapper></LinkedWrapper>
            ) : (
              <>Ei linkitettyjä koodistoja.</>
            )}
          </BasicBlock>
        ) : (
          <></>
        )}

        <BasicBlock title="Linkitetyt tietomallit">
          {data.datamodels && data.datamodels.length > 0 ? (
            <LinkedWrapper>
              {data.datamodels.map((d, idx) => (
                <LinkedItem key={`linked-datamodel-${idx}`}>
                  <ExternalLink labelNewWindow={'avaa uuteen'} href={d.uri}>
                    {d.label}
                  </ExternalLink>
                  <LinkExtraInfo>
                    <div>Tunnus: {d.identifier}</div>
                    <div>{d.uri.split('#')[0] + '#'}</div>
                  </LinkExtraInfo>
                </LinkedItem>
              ))}
            </LinkedWrapper>
          ) : (
            <>Ei linkitettyjä tietomalleja.</>
          )}
        </BasicBlock>
      </DrawerContent>
    </>
  );
}
