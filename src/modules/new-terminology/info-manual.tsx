import { useEffect, useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import ContactInfo from '@app/common/components/terminology-components/contact-info';
import InformationDomainsSelector from '@app/common/components/terminology-components/information-domains-selector';
import LanguageSelector from '@app/common/components/terminology-components/language-selector';
import { TallerSeparator } from './new-terminology.styles';
import OrganizationSelector from '@app/common/components/terminology-components/organization-selector';
import Prefix from '@app/common/components/terminology-components/prefix';
import TypeSelector from '@app/common/components/terminology-components/type-selector';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { useTranslation } from 'next-i18next';
import { TerminologyDataInitialState } from './terminology-initial-state';
import { UpdateTerminology } from './update-terminology.interface';
import StatusSelector from './status-selector';

interface InfoManualProps {
  setIsValid: (valid: boolean) => void;
  setManualData: (object: NewTerminologyInfo) => void;
  userPosted: boolean;
  initialData?: NewTerminologyInfo;
  onChange: () => void;
}

export default function InfoManual({
  setIsValid,
  setManualData,
  userPosted,
  initialData,
  onChange,
}: InfoManualProps) {
  const { t } = useTranslation('admin');
  const [terminologyData, setTerminologyData] = useState<NewTerminologyInfo>(
    initialData ? initialData : TerminologyDataInitialState
  );

  useEffect(() => {
    if (!terminologyData) {
      return;
    }

    let valid = true;

    if (Object.keys(terminologyData).length < 6) {
      valid = false;
    } else {
      Object.entries(terminologyData).forEach(([key, value]) => {
        if (key === 'contact') {
          return;
        }

        if (!value || value.length < 1 || value[1] === false) {
          valid = false;
        }
      });
    }

    setIsValid(valid);
    setManualData(terminologyData);
  }, [terminologyData, setIsValid, setManualData]);

  const handleUpdate = ({ key, data }: UpdateTerminology) => {
    setTerminologyData((values) => ({ ...values, [key]: data }));
    onChange();
  };

  return (
    <form>
      <TallerSeparator />
      <LanguageSelector
        update={handleUpdate}
        userPosted={userPosted}
        initialData={terminologyData}
      />
      <TallerSeparator />
      <Paragraph marginBottomSpacing="m">
        <Text variant="bold">{t('terminology-other-information')}</Text>
      </Paragraph>
      <OrganizationSelector
        update={handleUpdate}
        userPosted={userPosted}
        initialData={initialData}
      />
      <TypeSelector update={handleUpdate} defaultValue={initialData?.type} />

      {initialData && (
        <StatusSelector
          update={handleUpdate}
          userPosted={userPosted}
          defaultValue={initialData.status}
        />
      )}

      <InformationDomainsSelector
        update={handleUpdate}
        userPosted={userPosted}
        initialData={initialData}
      />

      {!initialData && <Prefix update={handleUpdate} userPosted={userPosted} />}

      <TallerSeparator />
      <ContactInfo
        update={handleUpdate}
        userPosted={userPosted}
        defaultValue={initialData?.contact}
      />
    </form>
  );
}
