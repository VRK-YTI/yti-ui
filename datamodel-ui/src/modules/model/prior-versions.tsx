import { useGetPriorVersionsQuery } from '@app/common/components/model/model.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  ExternalLink,
  LoadingSpinner,
} from 'suomifi-ui-components';
import { StatusChip } from 'yti-common-ui/status-chip';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { PriorVersionsDetails, PriorVersionsWrapper } from './model.styles';

export default function PriorVersions({
  modelId,
  version,
}: {
  modelId: string;
  version?: string;
}) {
  const { t, i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const { data: priorVersions, isLoading } = useGetPriorVersionsQuery(
    { modelId, version },
    { skip: !open }
  );

  function renderPriorVersions() {
    if (!priorVersions || priorVersions?.length === 0) {
      return <>{t('no-prior-versions')}</>;
    }

    return priorVersions.map((version) => {
      return (
        <div key={version.version}>
          <ExternalLink
            labelNewWindow=""
            href={`/model/${modelId}?ver=${version.version}`}
          >
            {getLanguageVersion({
              data: version.label,
              lang: i18n.language,
              appendLocale: true,
            })}
          </ExternalLink>
          <PriorVersionsDetails>
            {`${t('version')} ${version.version}`}
            <StatusChip status={version.status}>
              {translateStatus(version.status, t)}
            </StatusChip>
          </PriorVersionsDetails>
        </div>
      );
    });
  }

  return (
    <Expander open={open} onOpenChange={() => setOpen(!open)}>
      <ExpanderTitleButton>{t('prior-versions')}</ExpanderTitleButton>
      <ExpanderContent>
        <PriorVersionsWrapper>
          {isLoading ? (
            <LoadingSpinner
              variant="small"
              text={t('fetching-prior-versions')}
            />
          ) : (
            renderPriorVersions()
          )}
        </PriorVersionsWrapper>
      </ExpanderContent>
    </Expander>
  );
}
