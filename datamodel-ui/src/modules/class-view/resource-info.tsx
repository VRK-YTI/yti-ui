import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import { useGetResourceQuery } from '@app/common/components/resource/resource.slice';
import { useState } from 'react';
import CommonViewContent from '@app/modules/common-view-content';

export default function ResourceInfo({
  data,
  modelId,
}: {
  data: {
    identifier: string;
    label: {
      [key: string]: string;
    };
    modelId: string;
    uri: string;
  };
  modelId: string;
}) {
  const { i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const { data: resourceData, isSuccess } = useGetResourceQuery(
    {
      modelId: modelId,
      resourceIdentifier: data.identifier,
    },
    { skip: !open }
  );

  return (
    <Expander open={open} onOpenChange={() => setOpen(!open)}>
      <ExpanderTitleButton>
        {getLanguageVersion({
          data: data.label,
          lang: i18n.language,
          appendLocale: true,
        })}
      </ExpanderTitleButton>
      <ExpanderContent>
        {isSuccess && (
          <CommonViewContent
            data={resourceData}
            modelId={modelId}
            displayLabel
          />
        )}
      </ExpanderContent>
    </Expander>
  );
}
