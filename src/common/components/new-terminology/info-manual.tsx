import { useTranslation } from 'next-i18next';
import { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { Paragraph, Text } from 'suomifi-ui-components';
import { selectLogin } from '../login/login-slice';
import { useBreakpoints } from '../media-query/media-query-context';
import ContactInfo from './contact-info';
import InformationDomainsSelector from './information-domains-selector';
import LanguageSelector from './language-selector';
import { TallerSeparator } from './new-terminology.styles';
import OrganizationSelector from './organization-selector';
import Prefix from './prefix';
import TypeSelector from './type-selector';

interface InfoManualProps {
  setIsValid: Dispatch<SetStateAction<boolean>>;
}

export default function InfoManual({ setIsValid }: InfoManualProps) {
  const user = useSelector(selectLogin());
  const { isSmall } = useBreakpoints();
  const { i18n } = useTranslation('admin');

  return (
    <>
      <TallerSeparator />
      <LanguageSelector />
      <TallerSeparator />
      <Paragraph marginBottomSpacing='m'>
        <Text variant='bold'>Sanaston muut tiedot</Text>
      </Paragraph>
      <OrganizationSelector />
      <TypeSelector />
      <InformationDomainsSelector />
      <Prefix />
      <TallerSeparator />
      <ContactInfo />
    </>
  );
}
