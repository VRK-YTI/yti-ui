import { useTranslation } from 'react-i18next';
import { ExpanderContent, ExpanderTitleButton } from 'suomifi-ui-components';
import { InfoExpanderWrapper } from './info-expander.styles';
import InfoBlock from './info-block';
import InfoBasic from './info-basic';

interface InfoExpanderProps {
  data?: any;
  title: string;
}

export default function InfoExpander({data, title}: InfoExpanderProps) {
  const { t } = useTranslation('common');

  return (
    <InfoExpanderWrapper>
      <ExpanderTitleButton>
        {t('vocabulary-info-terminology')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <InfoBlock />
        <InfoBasic title={'Sanaston kielet'} data={[{fi: 'Suomi'}, {fi: 'Englanti'}, {fi: 'Ruotsi'}]}/>
        <InfoBasic title={'Sanastotyyppi'} data={'Terminologinen sanasto'} />
        <InfoBasic title={'Sisällöstä vastaa'} data={'Patentti- ja rekisterihallitus'} />
        <InfoBasic title={'Luotu'} data={'8.11.2019, 16.27'} />
      </ExpanderContent>
    </InfoExpanderWrapper>
  );
}
