import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  ExternalLink,
  HintText,
  Link,
  Text,
  Tooltip,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import Separator from 'yti-common-ui/separator';
import { StatusChip } from 'yti-common-ui/title/title.styles';
import { TooltipWrapper } from '../model/model.styles';

interface CommonViewProps {
  type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE;
  handleReturn: () => void;
}

export default function CommonView({ type, handleReturn }: CommonViewProps) {
  const { t } = useTranslation('common');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Button
            variant="secondaryNoBorder"
            icon="arrowLeft"
            style={{ textTransform: 'uppercase' }}
            onClick={() => handleReturn()}
          >
            assosiaatio-listaan
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text variant="bold">Rakennuskohteen omistaja</Text>
            <StatusChip>LUONNOS</StatusChip>
          </div>
          <div>
            <Button
              variant="secondary"
              iconRight="menu"
              style={{ height: 'min-content' }}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              Toiminnot
            </Button>
            <TooltipWrapper>
              <Tooltip
                ariaCloseButtonLabelText=""
                ariaToggleButtonLabelText=""
                open={showTooltip}
                onCloseButtonClick={() => setShowTooltip(false)}
              >
                <Button variant="secondaryNoBorder">
                  {t('edit', { ns: 'admin' })}
                </Button>
                <Separator />
                <Button variant="secondaryNoBorder">
                  {t('remove', { ns: 'admin' })}
                </Button>
              </Tooltip>
            </TooltipWrapper>
          </div>
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        <ExpanderGroup
          closeAllText=""
          openAllText=""
          showToggleAllButton={false}
        >
          <Expander>
            <ExpanderTitleButton>
              Käsitteen määritelmä
              <HintText>Rakennuskohteen omistaja</HintText>
            </ExpanderTitleButton>
          </Expander>
        </ExpanderGroup>

        <BasicBlock title="Assosiaation yksilöivä tunnus">
          jhs210:Rakennuskohteenomistaja
        </BasicBlock>

        <BasicBlock title="Yläassosiaatio">
          <Link href="" style={{ fontSize: '16px' }}>
            owl:TopObjectProperty
          </Link>
          <Button
            variant="secondary"
            icon="copy"
            style={{ width: 'min-content', whiteSpace: 'nowrap' }}
          >
            Kopioi leikepöydälle
          </Button>
        </BasicBlock>

        <BasicBlock title="Vastaavat assosiaatiot">
          <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
            <li>
              <Link href="" style={{ fontSize: '16px' }}>
                tunnus:Assosiaatio
              </Link>
            </li>
          </ul>
        </BasicBlock>

        <BasicBlock title="Assosiaation lisätiedot">
          Lisätietoa Rakennuskohteen omistajasta
        </BasicBlock>

        <Separator />

        <BasicBlock title="Viittaukset muista komponenteista">
          Ei viittauksia
        </BasicBlock>

        <Separator />

        <BasicBlock title="Luotu">15.10.2020 14:34</BasicBlock>

        <BasicBlock title="Muokattu viimeksi">26.10.2020 11:56</BasicBlock>

        <BasicBlock title="Muokkajaan kommentti">Kommentti tähän</BasicBlock>

        <Separator />

        <BasicBlock title="Sisällöntuottajat">Vantaan kaupunki</BasicBlock>

        {/* TODO: Replace with a proper component */}
        <div
          style={{ marginTop: '20px', marginBottom: '5px', fontSize: '16px' }}
        >
          <Text smallScreen>
            Voit antaa palautetta assosiaatiosta tietomallin
            vastuuorganisaatiolle
          </Text>
        </div>
        <ExternalLink href="" labelNewWindow="">
          Anna palautetta assosiaatiosta
        </ExternalLink>
      </DrawerContent>
    </>
  );
}
