import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Paragraph, Text } from 'suomifi-ui-components';
import { selectLogin } from '@app/common/components/login/login.slice';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import ContactInfo from './contact-info';
import InformationDomainsSelector from './information-domains-selector';
import LanguageSelector from './language-selector';
import { TallerSeparator } from './new-terminology.styles';
import OrganizationSelector from './organization-selector';
import Prefix from './prefix';
import TypeSelector from './type-selector';

interface InfoManualProps {
  setIsValid: (valid: boolean) => void;
  setManualData: (object: Object) => void;
}

export default function InfoManual({ setIsValid, setManualData }: InfoManualProps) {
  const user = useSelector(selectLogin());
  const { isSmall } = useBreakpoints();
  const { i18n } = useTranslation('admin');
  const [terminologyData, setTerminologyData] = useState({});

  useEffect(() => {
    let valid = true;

    if (Object.keys(terminologyData).length < 7) {
      valid = false;
    } else {
      Object.keys(terminologyData).forEach((k) => {
        if (k === 'otherOrgs') {
          return;
        }

        if (
          !terminologyData[k] ||
          terminologyData[k].length < 1 ||
          terminologyData[k][1] === false
        ) {
          valid = false;
        }
      });
    }

    setIsValid(valid);
    setManualData(terminologyData);
  }, [terminologyData]);

  const handleUpdate = (key: string, data: any) => {
    setTerminologyData((values) => ({ ...values, [key]: data }));
  };

  return (
    <>
      <TallerSeparator />
      <LanguageSelector update={handleUpdate} />
      <TallerSeparator />
      <Paragraph marginBottomSpacing="m">
        <Text variant="bold">Sanaston muut tiedot</Text>
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
