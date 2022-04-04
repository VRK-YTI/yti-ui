import { useEffect, useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import ContactInfo from './contact-info';
import InformationDomainsSelector from './information-domains-selector';
import LanguageSelector from './language-selector';
import { TallerSeparator } from './new-terminology.styles';
import OrganizationSelector from './organization-selector';
import Prefix from './prefix';
import TypeSelector from './type-selector';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';

interface InfoManualProps {
  setIsValid: (valid: boolean) => void;
  setManualData: (object: Object) => void;
}

export default function InfoManual({ setIsValid, setManualData }: InfoManualProps) {
  const [terminologyData, setTerminologyData] = useState<NewTerminologyInfo>();

  useEffect(() => {
    if (!terminologyData) {
      return;
    }

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
  }, [terminologyData, setIsValid, setManualData]);

  const handleUpdate = (key: string, data: any) => {
    setTerminologyData((values) => ({ ...values, [key]: data }));
  };

  return (
    <form>
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
    </form>
  );
}
