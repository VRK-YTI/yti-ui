import { useTranslation } from 'react-i18next';
import { Heading } from 'suomifi-ui-components';
import { Contributor, Description, StatusPill, TitleWrapper } from './title.stylex';
import InfoExpander from '../info-dropdown/info-expander';

export default function Title() {
  const { t } = useTranslation('common');

  return (
    <TitleWrapper>
      <Contributor>Patentti- ja rekisterihallitus</Contributor>
      <Heading variant='h1'>Testi</Heading>
      <StatusPill>{'Voimassa oleva'.toUpperCase()}</StatusPill>
      <InfoExpander title={t('vocabulary-info-terminology')} />
      <Description>Selite</Description>
    </TitleWrapper>
  );
}
