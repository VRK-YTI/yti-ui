import { useTranslation } from 'next-i18next';
import { Locale } from '../locale-chooser/use-locales';
import format from './format';

/**
 * Error handling:
 * - if date is missing should this return
 *   something else than nulL?
 */

export interface FormattedDateProps {
  date?: string;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const { i18n } = useTranslation('common');

  if (!date) {
    return null;
  }

  return (
    <>{format(date, i18n.language as Locale)}</>
  );
}
