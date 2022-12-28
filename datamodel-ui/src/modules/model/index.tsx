import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import { getPropertyLanguageVersion } from '@app/common/utils/get-language-version';
import Title from 'yti-common-ui/title';
import { useTranslation } from 'next-i18next';
import {
  StatusChip,
  TitleType,
  TitleTypeAndStatusWrapper,
} from 'yti-common-ui/title/title.styles';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { getStatus, getTitle, getType } from '@app/common/utils/get-value';
import { useEffect, useState } from 'react';

interface ModelModuleProps {
  modelId: string;
}

export default function ModelModule({ modelId }: ModelModuleProps) {
  const { t, i18n } = useTranslation('common');
  const [modelTitle, setModelTitle] = useState('');
  const [modelStatus, setModelStatus] = useState('');
  const [modelType, setModelType] = useState('');

  const { data: model } = useGetModelQuery(modelId);

  useEffect(() => {
    if (model) {
      setModelTitle(getTitle(model, i18n.language));
      setModelStatus(getStatus(model));
      setModelType(getType(model));
    }
  }, [model, i18n.language]);

  console.log('model', model);

  if (!model) {
    return <></>;
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url={`/model/${model['@graph'][1]['@id']}`} current>
          {modelTitle}
        </BreadcrumbLink>
      </Breadcrumb>

      <Title
        title={modelTitle}
        extra={
          <>
            <TitleTypeAndStatusWrapper>
              <TitleType>{t(modelType)}</TitleType> &middot;
              <StatusChip
                valid={modelStatus === 'VALID' ? 'true' : undefined}
                id="status-chip"
              >
                {translateStatus(modelStatus ?? 'DRAFT', t)}
              </StatusChip>
            </TitleTypeAndStatusWrapper>
          </>
        }
      />
    </>
  );
}
