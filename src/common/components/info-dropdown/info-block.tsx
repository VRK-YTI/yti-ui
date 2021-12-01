import { useTranslation } from 'react-i18next';
import { InfoBlockData, InfoBlockDescription, InfoBlockLanguage, InfoBlockTitle, InfoBlockWrapper } from './info-block.styles';

export default function InfoBlock() {
  const { t } = useTranslation('common');

  const data = [{ lang: 'fi', desc: 'desc1' }, { lang: 'sv', desc: 'desc2' }, { lang: 'fi', desc: 'desc3' }, { lang: 'sv', desc: 'desc4' }];

  return (
    <InfoBlockWrapper>
      <InfoBlockTitle>
        Otsikko
      </InfoBlockTitle>
      <InfoBlockData>
        {data.map((d: any, idx: number) => {
          return (
            <div key={`info-block-${idx}`}>
              <InfoBlockLanguage>
                {d.lang.toUpperCase()}
              </InfoBlockLanguage>
              <InfoBlockDescription>
                {d.desc}
              </InfoBlockDescription>
            </div>
          );
        })}
      </InfoBlockData>
    </InfoBlockWrapper>
  );
}
