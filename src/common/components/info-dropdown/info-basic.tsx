import { useTranslation } from 'react-i18next';
import { InfoBasicLanguageWrapper, InfoBasicWrapper } from './info-basic.styles';
import { Text } from 'suomifi-ui-components';

interface InfoBasicProps {
  data: any;
  title: string;
}

export default function InfoBasic({ data, title }: InfoBasicProps) {
  const { t, i18n } = useTranslation('common');

  return (
    <InfoBasicWrapper>
      <Text variant='bold'>{title}</Text>
      {
        typeof data === 'string'
          ?
          <Text>{typeof data === 'string' && data}</Text>
          :
          <InfoBasicLanguageWrapper>
            {
              data?.[0].lang !== ''
                ?
                <Text key={`basic-info-${title}`}>
                  {data?.find((d: any) => d.lang === i18n.language).value}
                </Text>
                :
                data.map((d: any, idx: number) => {
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
                })
            }
          </InfoBasicLanguageWrapper>
      }

    </InfoBasicWrapper>
  );
}
