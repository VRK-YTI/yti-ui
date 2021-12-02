import { useTranslation } from 'react-i18next';
import { Heading } from 'suomifi-ui-components';
import { Contributor, Description, StatusPill, TitleWrapper } from './title.stylex';
import InfoExpander from '../info-dropdown/info-expander';

interface TitleProps {
  info: any;
}

export default function Title({ info }: TitleProps) {
  const { t, i18n } = useTranslation('common');

  const vocabularyTitle = info?.code != undefined;
  const status = info?.properties.status[0].value;
  const title = info?.properties.prefLabel.find((pLabel: any) => {
    if (pLabel.lang === i18n.language) {
      return pLabel;
    }
  }).value ?? '';
  const contributor = info?.references.contributor?.[0].properties.prefLabel?.find((pLabel: any) => {
    if (pLabel.lang === i18n.language) {
      return pLabel;
    }
  }).value ?? '';

  return (
    <TitleWrapper>
      <Contributor>{contributor}</Contributor>

      <Heading variant='h1'>{title}</Heading>

      <StatusPill valid={status === 'VALID' ? 'true' : undefined}>
        {t(`${status}`)}
      </StatusPill>

      <InfoExpander data={info} />

      {!vocabularyTitle && <Description>Selite</Description>}
    </TitleWrapper>
  );
}
