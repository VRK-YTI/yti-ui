import dayjs from 'dayjs';
import { Locale } from '../locale-chooser/use-locales';

export default function format(date: string, locale: Locale): string {
  const formats: { [key in Locale]: string; } = {
    fi: 'D.M.YYYY, H.mm',
    sv: 'D.M.YYYY [kl.] H.mm',
    en: 'DD/MM/YYYY, H.mm',
  };

  return dayjs(date).format(formats[locale]);
}
