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
import { useTranslation } from 'next-i18next';

interface InfoManualProps {
  setIsValid: (valid: boolean) => void;
  setManualData: (object: any) => void;
  userPosted: boolean;
}

export default function InfoManual({ setIsValid, setManualData, userPosted }: InfoManualProps) {
  const { t } = useTranslation('admin');
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

  console.log('terminologyData', terminologyData);

  return (
    <form>
      <TallerSeparator />
      <LanguageSelector update={handleUpdate} userPosted={userPosted} />
      <TallerSeparator />
      <Paragraph marginBottomSpacing="m">
        <Text variant="bold">{t('terminology-other-information')}</Text>
      </Paragraph>
      <OrganizationSelector update={handleUpdate} userPosted={userPosted} />
      <TypeSelector update={handleUpdate} />
      <InformationDomainsSelector update={handleUpdate} userPosted={userPosted} />
      <Prefix update={handleUpdate} userPosted={userPosted} />
      <TallerSeparator />
      <ContactInfo update={handleUpdate} userPosted={userPosted} />
    </form>
  );
}
