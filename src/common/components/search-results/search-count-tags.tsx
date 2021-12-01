import { useTranslation } from 'react-i18next';
import {
  CountPill,
  CountPillIcon,
  CountPillWrapper,
  CountText,
  CountWrapper
} from './search-count-tags.styles';

export default function SearchCountTags({ count }: any) {
  const { t } = useTranslation('common');

  const temp = ['Voimassa oleva', 'Luonnos'];

  return (
    <CountWrapper>
      <CountText>
        Käsitteitä {count} kpl seuraavilla rajauksilla
      </CountText>
      <CountPillWrapper>
        {temp.map((t: any, idx: number) => {
          return (
            <CountPill key={idx}>
              {t} <CountPillIcon icon='close' />
            </CountPill>
          );
        })}
      </CountPillWrapper>
    </CountWrapper>
  );
}
