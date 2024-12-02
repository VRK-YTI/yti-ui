import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useGetIfNamespaceInUseMutation } from '@app/common/components/vocabulary/vocabulary.slice';
import { BlankFieldset, TextInputSmBot } from './terminology-components.styles';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';

export interface PrefixProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  disabled?: boolean;
}

export default function Prefix({ update, userPosted, disabled }: PrefixProps) {
  const URI = 'https://iri.suomi.fi/terminology/';
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [prefix, setPrefix] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>('default');
  const [prefixValid, setPrefixValid] = useState(true);
  const [initDone, setInitDone] = useState(false);
  const [getIsInUse, isInUse] = useGetIfNamespaceInUseMutation();

  useEffect(() => {
    if (!initDone) {
      update({ key: 'prefix', data: [prefix, true] });
      setInitDone(true);
    }
  }, [initDone, prefix, update]);

  useEffect(() => {
    if (!isInUse.isSuccess) {
      return;
    }

    if (isInUse.data === true && status !== 'error') {
      setStatus('error');
      update({ key: 'prefix', data: [prefix, false] });
    } else if (isInUse.data === false && prefixValid) {
      setStatus('default');
    }
  }, [isInUse, update, prefix, status, prefixValid]);

  const handleCustomChange = (e: string) => {
    setPrefix(e);
    const inputOnlyValid = e.match(/[a-z0-9\-_]*/g)?.join('');
    setPrefixValid(inputOnlyValid?.length === e.length);

    if (inputOnlyValid?.length !== e.length) {
      setStatus('error');
      update({ key: 'prefix', data: [e, false] });
      return;
    } else if (status !== 'default') {
      setStatus('default');
    }

    if (e !== '') {
      getIsInUse(e);
    }

    update({ key: 'prefix', data: [e, e !== ''] });
  };

  return (
    <BlankFieldset>
      <TextInputSmBot
        labelText={t('prefix')}
        onChange={(e) => handleCustomChange(e?.toString().trim() ?? '')}
        debounce={300}
        $isSmall={isSmall ? true : undefined}
        status={
          status === 'error' || (userPosted && !prefix) ? 'error' : 'default'
        }
        statusText={
          status === 'error'
            ? isInUse.data === true
              ? t('prefix-taken')
              : t('prefix-invalid')
            : ''
        }
        maxLength={TEXT_INPUT_MAX}
        id="prefix-text-input"
        disabled={disabled}
      />

      <Paragraph>
        <Text variant="bold" smallScreen>
          {t('url-preview')}
        </Text>
      </Paragraph>
      <Paragraph>
        <Text smallScreen>
          {URI}
          {prefix}
          {prefix && '/'}
        </Text>
      </Paragraph>
    </BlankFieldset>
  );
}
