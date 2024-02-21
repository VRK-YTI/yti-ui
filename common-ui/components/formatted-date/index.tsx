import { useTranslation } from 'next-i18next';
import { Locale } from '../locale-chooser/use-locales';
import format from './format';
import { useEffect, useState } from 'react';

export interface FormattedDateProps {
  date?: string;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const { i18n } = useTranslation('common');
  const [fdate, setFdate] = useState<string | undefined>(undefined);

  // To avoid error "Text content does not match server-rendered HTML",
  // render the formatted date only on client-side
  // https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only
  useEffect(() => {
    if (date) {
      setFdate(format(date, i18n.language as Locale));
    }
  }, [date, i18n.language]);

  if (!date) {
    return null;
  }

  return <>{fdate}</>;
}
