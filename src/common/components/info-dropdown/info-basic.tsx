import { useTranslation } from 'react-i18next';
import { InfoBasicLanguageWrapper, InfoBasicWrapper } from './info-basic.styles';
import { Text } from 'suomifi-ui-components';
import { Property } from '../../interfaces/termed-data-types.interface';

interface InfoBasicProps {
  data: Property[] | string;
  title: string;
  extra?: React.ReactNode;
}

export default function InfoBasic({ data, title, extra }: InfoBasicProps) {
  const { t, i18n } = useTranslation('common');

  if (typeof data === 'string') {
    return (
      <InfoBasicWrapper>
        <Text variant='bold'>{title}</Text>
        <Text>{data}</Text>
        {extra}
      </InfoBasicWrapper>
    );
  } else if (data.length > 0 && 'lang' in data[0]) {
    if (data[0].lang !== '') {
      return (
        <InfoBasicWrapper>
          <Text variant='bold'>{title}</Text>
          <InfoBasicLanguageWrapper>
            <Text key={`basic-info-${title}`}>
              {data.find(d => d.lang === i18n.language)?.value}
            </Text>
          </InfoBasicLanguageWrapper>
          {extra}
        </InfoBasicWrapper>
      );
    } else {
      return (
        <InfoBasicWrapper>
          <Text variant='bold'>{title}</Text>
          <InfoBasicLanguageWrapper>
            {data.map((d, idx: number) => {
              return (
                <Text key={`basic-info-${title}-${idx}`}>
                  {
                    idx !== 0
                      ?
                      <>, {t(`vocabulary-info-${d.value}`)} {d.value.toUpperCase()}</>
                      :
                      <>{t(`vocabulary-info-${d.value}`)} {d.value.toUpperCase()}</>
                  }
                </Text>
              );
            })}
          </InfoBasicLanguageWrapper>
          {extra}
        </InfoBasicWrapper>
      );
    }
  }

  return <></>;
}
