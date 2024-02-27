import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button, IconArrowLeft, InlineAlert } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';

interface ResourceErrorProps {
  handleReturn?: () => void;
  noHeader?: boolean;
}

export default function ResourceError({
  handleReturn,
  noHeader = false,
}: ResourceErrorProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(55);

  const handleReturnFallback = () => {
    const modelId = router.query.slug?.[0];
    const resourceType = router.query.slug?.[1];

    if (!modelId) {
      router.push('/');
      return;
    }

    if (!resourceType) {
      router.push(`/model/${modelId}/info`);
    }

    switch (resourceType) {
      case 'class':
        router.push(`/model/${modelId}/classes`);
        break;
      case 'association':
        router.push(`/model/${modelId}/associations`);
        break;
      default:
        router.push(`/model/${modelId}/attributes`);
        break;
    }
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  if (noHeader) {
    return RenderError();
  }

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Button
            variant="secondaryNoBorder"
            icon={<IconArrowLeft />}
            onClick={() =>
              handleReturn ? handleReturn() : handleReturnFallback()
            }
            style={{ textTransform: 'uppercase' }}
          >
            {t('back')}
          </Button>
        </div>
      </StaticHeader>
      <DrawerContent height={headerHeight}>{RenderError()}</DrawerContent>
    </>
  );
}

function RenderError() {
  const { t } = useTranslation('common');

  return (
    <InlineAlert status="error">
      {t('an-error-occured-while-fetching-resource')}
      <br />
      {t('you-can-try-to-reload-the-page-or-the-resource-does-not-exist')}
    </InlineAlert>
  );
}
