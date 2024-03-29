import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Paragraph, RadioButton, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useGetIfNamespaceInUseMutation } from '@app/common/components/vocabulary/vocabulary.slice';
import {
  BlankFieldset,
  RadioButtonGroupSmBot,
  TextInputSmBot,
} from './terminology-components.styles';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { v4 } from 'uuid';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';

export interface PrefixProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  disabled?: boolean;
}

export default function Prefix({ update, userPosted, disabled }: PrefixProps) {
  const URI = 'http://uri.suomi.fi/';
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [randomURL] = useState(v4().substring(0, 8));
  const [prefix, setPrefix] = useState(randomURL);
  const [prefixType, setPrefixType] = useState('');
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

    getIsInUse(e !== '' ? e : randomURL);

    update({ key: 'prefix', data: [e, e !== ''] });
  };

  return (
    <BlankFieldset>
      <RadioButtonGroupSmBot
        labelText={t('prefix')}
        groupHintText={t('prefix-hint')}
        name="prefix"
        defaultValue="automatic"
        onChange={(e) => {
          handlePrefixTypeChange(e);
        }}
        id="prefix-input-type-selector"
      >
        <RadioButton
          value="automatic"
          id="prefix-input-automatic"
          disabled={disabled}
        >
          {t('automatic-prefix')}
        </RadioButton>
        <RadioButton
          value="manual"
          id="prefix-input-manual"
          disabled={disabled}
        >
          {t('manual-prefix')}
        </RadioButton>
      </RadioButtonGroupSmBot>
      {prefixType === 'manual' && (
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
