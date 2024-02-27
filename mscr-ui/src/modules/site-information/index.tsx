import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { Heading, Text } from 'suomifi-ui-components';

const StyledHeading = styled(Heading)`
  margin-bottom: 30px;
`;

const StyledText = styled(Text)`  
  display: block;
  margin-bottom: 30px;
`;

const StyledList = styled.ul`
  margin-top: 15px;
  padding-left: 30px;
`;

export default function SiteInformationModule() {
  const { t } = useTranslation('common');

  return (
    <>
      <StyledHeading variant="h1">{t('landing.title')}</StyledHeading>
      <StyledText variant="lead">{t('landing.description')}</StyledText>
      <Heading variant="h2" >{t('landing.what-can-do')}</Heading>
      <StyledList>
        <li><Text >{t('landing.bullet-1')}</Text></li>
        <li><Text>{t('landing.bullet-2')}</Text></li>
        {/*<li><Text>{t('landing.bullet-3')}</l</Text>i>*/}
        {/*<li><Text>{t('landing.bullet-4')}</l</Text>i>*/}
        <li><Text>{t('landing.bullet-5')}</Text></li>
        <li><Text>{t('landing.bullet-6')}</Text></li>
      </StyledList>
    </>
  );
}
