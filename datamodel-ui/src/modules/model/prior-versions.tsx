import { useGetPriorVersionsQuery } from '@app/common/components/model/model.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  ExternalLink,
} from 'suomifi-ui-components';
import { Status } from 'yti-common-ui/search-results/result-card.styles';
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
  const { data: priorVersions } = useGetPriorVersionsQuery(
    { modelId, version },
    { skip: !open }
  );
  return (
    <Expander open={open} onOpenChange={() => setOpen(!open)}>
      <ExpanderTitleButton>{t('prior-versions')}</ExpanderTitleButton>
      <ExpanderContent>
        <PriorVersionsWrapper>
          {priorVersions?.map((version) => {
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
                  <Status status={version.status}>
                    {translateStatus(version.status, t)}
                  </Status>
                </PriorVersionsDetails>
              </div>
            );
          })}
        </PriorVersionsWrapper>
      </ExpanderContent>
    </Expander>
  );
}
