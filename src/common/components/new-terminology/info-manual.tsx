import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
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
  setIsValid: (valid: boolean) => void;
}

export default function InfoManual({ setIsValid }: InfoManualProps) {
  const user = useSelector(selectLogin());
  const { isSmall } = useBreakpoints();
  const { i18n } = useTranslation('admin');
  const [terminologyData, setTerminologyData] = useState({});

  useEffect(() => {
    let valid = true;
    Object.keys(terminologyData).forEach(k => {
      if (!terminologyData[k]) {
        valid = false;
      }
    });
    setIsValid(valid);
  }, [terminologyData]);

  const handleUpdate = (key: string, data: any) => {
    setTerminologyData(values => ({...values, [key]: data}));
  };

  return (
    <>
      <TallerSeparator />
      <LanguageSelector update={handleUpdate} />
      <TallerSeparator />
      <Paragraph marginBottomSpacing='m'>
        <Text variant='bold'>Sanaston muut tiedot</Text>
      </Paragraph>
      <OrganizationSelector update={handleUpdate} />
      <TypeSelector update={handleUpdate} />
      <InformationDomainsSelector update={handleUpdate} />
      <Prefix update={handleUpdate} />
      <TallerSeparator />
      <ContactInfo update={handleUpdate} />
    </>
  );
}
