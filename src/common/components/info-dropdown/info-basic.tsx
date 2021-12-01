import { useTranslation } from 'react-i18next';
import { InfoBasicLanguageWrapper, InfoBasicWrapper } from './info-basic.styles';
import { Text } from 'suomifi-ui-components';

interface InfoBasicProps {
  data?: any;
  title: string;
}

export default function InfoBasic({ data, title }: InfoBasicProps) {
  const { t } = useTranslation('common');

  return (
    <InfoBasicWrapper>
      <Text variant='bold'>{title}</Text>
      {
        typeof data === 'string'
          ?
          <Text>{typeof data === 'string' && data}</Text>
          :
          <InfoBasicLanguageWrapper>
            {data.map((d: any, idx: number) => {
              return (
                <Text key={`basic-info-${title}-${idx}`}>
                  {
                    idx === data.length - 1
                      ?
                      <>{d.fi}</>
                      :
                      <>{d.fi},</>
                  }
                </Text>
              );
            })}
          </InfoBasicLanguageWrapper>
      }

    </InfoBasicWrapper>
  );
}
