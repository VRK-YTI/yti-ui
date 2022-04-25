import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Paragraph, RadioButton, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { useGetIfNamespaceInUseQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import {
  BlankFieldset,
  RadioButtonGroupSmBot,
  TextInputSmBot,
} from './new-terminology.styles';
import { UpdateTerminology } from './update-terminology.interface';
import { v4 } from 'uuid';

export interface PrefixProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
}

export default function Prefix({ update, userPosted }: PrefixProps) {
  const URI = 'http://uri.suomi.fi/';
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [randomURL] = useState(v4().substring(0, 8));
  const [prefix, setPrefix] = useState(randomURL);
  const [prefixType, setPrefixType] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>('default');
  const [prefixValid, setPrefixValid] = useState(true);
  const [initDone, setInitDone] = useState(false);
  const { data: isInUse } = useGetIfNamespaceInUseQuery(
    prefix !== '' ? prefix : randomURL
  );

  useEffect(() => {
    if (!initDone) {
      update({ key: 'prefix', data: [prefix, true] });
      setInitDone(true);
    }
  }, [initDone, prefix, update]);

  useEffect(() => {
    if (isInUse && status !== 'error') {
      setStatus('error');
      update({ key: 'prefix', data: [prefix, false] });
    } else if (!isInUse && prefixValid) {
      setStatus('default');
    }
  }, [isInUse, update, prefix, status, prefixValid]);

  const handlePrefixTypeChange = (value: string) => {
    setPrefixType(value);
    if (value !== 'manual') {
      setPrefix(randomURL);
      update({ key: 'prefix', data: [randomURL, true] });
    } else {
      setPrefix('');
      update({ key: 'prefix', data: ['', false] });
    }
  };

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

    update({ key: 'prefix', data: [e, e !== ''] });
  };

  return (
    <BlankFieldset>
      <RadioButtonGroupSmBot
        labelText={t('prefix')}
        hintText={t('prefix-hint')}
        name="prefix"
        defaultValue="automatic"
        onChange={(e) => {
          handlePrefixTypeChange(e);
        }}
      >
        <RadioButton value="automatic">{t('automatic-prefix')}</RadioButton>
        <RadioButton value="manual">{t('manual-prefix')}</RadioButton>
      </RadioButtonGroupSmBot>
      {prefixType === 'manual' && (
        <TextInputSmBot
          labelText={t('prefix')}
          onChange={(e) => handleCustomChange(e as string)}
          debounce={300}
          issmall={isSmall ? true : undefined}
          status={
            status === 'error' || (userPosted && !prefix) ? 'error' : 'default'
          }
          statusText={
            status === 'error'
              ? isInUse
                ? t('prefix-taken')
                : t('prefix-invalid')
              : ''
          }
        />
      )}
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
