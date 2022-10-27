import { useTranslation } from 'next-i18next';
import { Locale } from '@app/common/components/locale-chooser/use-locales';
import format from './format';

export interface FormattedDateProps {
  date?: string;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const { i18n } = useTranslation('common');

  if (!date) {
    return null;
  }

  return <>{format(date, i18n.language as Locale)}</>;
}
