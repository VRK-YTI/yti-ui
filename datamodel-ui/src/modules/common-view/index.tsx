import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import HasPermission from '@app/common/utils/has-permission';
import {
  translateCommonForm,
  translateStatus,
} from '@app/common/utils/translation-helpers';
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
import FormattedDate from 'yti-common-ui/formatted-date';
import Separator from 'yti-common-ui/separator';
import { StatusChip } from '@app/common/components/multi-column-search/multi-column-search.styles';
import { TooltipWrapper } from '../model/model.styles';
import DeleteModal from '../delete-modal';

interface CommonViewProps {
  data: Resource;
  modelId: string;
  handleReturn: () => void;
}

export default function CommonView({
  data,
  modelId,
  handleReturn,
}: CommonViewProps) {
  const { t, i18n } = useTranslation('common');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasPermission = HasPermission({
    actions: ['ADMIN_ASSOCIATION', 'ADMIN_ATTRIBUTE'],
  });
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
            onClick={handleReturn}
          >
            {translateCommonForm('return', data.type, t)}
          </Button>
          {hasPermission && (
            <div>
              <Button
                variant="secondary"
                iconRight="menu"
                style={{ height: 'min-content' }}
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
                  <Button variant="secondaryNoBorder">
                    {t('edit', { ns: 'admin' })}
                  </Button>
                  <Separator />
                  <DeleteModal
                    modelId={modelId}
                    resourceId={data.identifier}
                    type={
                      data.type === 'ASSOCIATION' ? 'association' : 'attribute'
                    }
                    label={getLanguageVersion({
                      data: data.label,
                      lang: i18n.language,
                    })}
                    onClose={handleReturn}
                  />
                </Tooltip>
              </TooltipWrapper>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text variant="bold">
              {getLanguageVersion({
                data: data.label,
                lang: i18n.language,
              })}
            </Text>
            <StatusChip $isValid={data.status === 'VALID'}>
              {translateStatus(data.status, t)}
            </StatusChip>
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

        <BasicBlock title={translateCommonForm('identifier', data.type, t)}>
          {`${modelId}:${data.identifier}`}
          <Button
            icon="copy"
            variant="secondary"
            style={{ width: 'min-content', whiteSpace: 'nowrap' }}
            onClick={() => navigator.clipboard.writeText(data.identifier)}
          >
            {t('copy-to-clipboard')}
          </Button>
        </BasicBlock>

        <BasicBlock title={translateCommonForm('upper', data.type, t)}>
          {!data.subResourceOf || data.subResourceOf.length === 0 ? (
            <>{translateCommonForm('no-upper', data.type, t)}</>
          ) : (
            <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
              {data.subResourceOf.map((c) => (
                <li key={c}>
                  <Link key={c} href={c} style={{ fontSize: '16px' }}>
                    {c.split('/').pop()?.replace('#', ':')}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </BasicBlock>

        <BasicBlock title={translateCommonForm('equivalent', data.type, t)}>
          {!data.equivalentResource || data.equivalentResource.length === 0 ? (
            <>{translateCommonForm('no-equivalent', data.type, t)}</>
          ) : (
            <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
              {data.equivalentResource.map((c) => (
                <li key={c}>
                  <Link key={c} href={c} style={{ fontSize: '16px' }}>
                    {c.split('/').pop()?.replace('#', ':')}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </BasicBlock>

        <BasicBlock title={translateCommonForm('note', data.type, t)}>
          {getLanguageVersion({
            data: data.note,
            lang: i18n.language,
          }) || t('no-note')}
        </BasicBlock>

        <Separator />

        <BasicBlock title="Viittaukset muista komponenteista">
          Ei viittauksia
        </BasicBlock>

        <Separator />

        <BasicBlock title={t('created')}>
          <FormattedDate date={data.created} />
        </BasicBlock>

        <BasicBlock title={t('modified-at')}>
          <FormattedDate date={data.created} />
        </BasicBlock>

        <BasicBlock title={t('editorial-note')}>
          {data.editorialNote ?? t('no-editorial-note')}
        </BasicBlock>

        <BasicBlock title={t('uri')}>{data.uri}</BasicBlock>
        <Separator />

        <BasicBlock title={t('contributors')}>
          {data.contributor?.map((contributor) =>
            getLanguageVersion({
              data: contributor.label,
              lang: i18n.language,
            })
          )}
        </BasicBlock>
        <BasicBlock>
          {translateCommonForm('contact-description', data.type, t)}
          <ExternalLink
            href={`mailto:${
              data.contact ?? 'yhteentoimivuus@dvv.fi'
            }?subject=${getLanguageVersion({
              data: data.label,
              lang: i18n.language,
            })}`}
            labelNewWindow=""
          >
            {translateCommonForm('contact', data.type, t)}
          </ExternalLink>
        </BasicBlock>
      </DrawerContent>
    </>
  );
}
