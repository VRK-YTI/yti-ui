import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import { useGetResourceMutation } from '@app/common/components/resource/resource.slice';
import { useEffect, useState } from 'react';
import CommonViewContent from '../common-view/common-view-content';

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
  const [getResource, result] = useGetResourceMutation();

  useEffect(() => {
    if (open) {
      getResource({
        modelId: modelId,
        resourceIdentifier: data.identifier,
      });
    }
  }, [open, data.identifier, getResource, modelId]);

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
        {result.data && (
          <CommonViewContent
            data={result.data}
            modelId={modelId}
            displayLabel
          />
        )}
      </ExpanderContent>
    </Expander>
  );
}
