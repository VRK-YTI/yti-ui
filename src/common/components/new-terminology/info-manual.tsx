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
import { TerminologyDataInitialState } from './terminology-initial-state';
import { UpdateTerminology } from './update-terminology.interface';

interface InfoManualProps {
  setIsValid: (valid: boolean) => void;
  setManualData: (object: NewTerminologyInfo) => void;
  userPosted: boolean;
}

export default function InfoManual({ setIsValid, setManualData, userPosted }: InfoManualProps) {
  const { t } = useTranslation('admin');
  const [terminologyData, setTerminologyData] = useState<NewTerminologyInfo>(TerminologyDataInitialState);

  useEffect(() => {
    if (!terminologyData) {
      return;
    }

    let valid = true;

    if (Object.keys(terminologyData).length < 7) {
      valid = false;
    } else {
      Object.entries(terminologyData).forEach(([key, value]) => {
        if (key === 'otherOrgs') {
          return;
        }

        if (
          !value ||
          value.length < 1 ||
          value[1] === false
        ) {
          valid = false;
        }
      });
    }

    setIsValid(valid);
    setManualData(terminologyData);
  }, [terminologyData, setIsValid, setManualData]);

  const handleUpdate = ({ key, data }: UpdateTerminology) => {
    console.log('data', data);
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
