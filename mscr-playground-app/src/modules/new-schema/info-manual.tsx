import { useEffect, useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import ContactInfo from '@app/common/components/terminology-components/contact-info';
import InformationDomainsSelector from '@app/common/components/terminology-components/information-domains-selector';
import LanguageSelector from '@app/common/components/terminology-components/language-selector';
import { TallerSeparator } from './new-terminology.styles';
import OrganizationSelector from '@app/common/components/terminology-components/organization-selector';
// import Prefix from '@app/common/components/terminology-components/prefix';
import Prefix from 'yti-common-ui/form/prefix';
import TypeSelector from '@app/common/components/terminology-components/type-selector';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { useTranslation } from 'next-i18next';
import { TerminologyDataInitialState } from './terminology-initial-state';
import { UpdateTerminology } from './update-terminology.interface';
import StatusSelector from './status-selector';
import isEmail from 'validator/lib/isEmail';
import { useGetIfNamespaceInUseMutation } from '@app/common/components/vocabulary/vocabulary.slice';

interface InfoManualProps {
  setIsValid: (valid: boolean) => void;
  setManualData: (object: NewTerminologyInfo) => void;
  userPosted: boolean;
  initialData?: NewTerminologyInfo;
  onChange: () => void;
  disabled?: boolean;
}

export default function InfoManual({
  setIsValid,
  setManualData,
  userPosted,
  initialData,
  onChange,
  disabled,
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
        if (key === 'contact' && value !== '' && !isEmail(value)) {
          valid = false;
        }

        if (
          key !== 'contact' &&
          (!value || value.length < 1 || value[1] === false)
        ) {
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
      {/* <TallerSeparator /> */}
      <LanguageSelector
        disabled={disabled}
        update={handleUpdate}
        userPosted={userPosted}
        initialData={terminologyData}
      />
      <TallerSeparator />
      <Paragraph marginBottomSpacing="m">
        <Text variant="bold">{t('terminology-other-information')}</Text>
      </Paragraph>
      <OrganizationSelector
        disabled={disabled}
        update={handleUpdate}
        userPosted={userPosted}
        initialData={initialData}
      />
      <TypeSelector
        disabled={disabled}
        update={handleUpdate}
        defaultValue={initialData?.type}
      />

      {initialData && (
        <StatusSelector
          update={handleUpdate}
          userPosted={userPosted}
          defaultValue={initialData.status}
        />
      )}

      <InformationDomainsSelector
        disabled={disabled}
        update={handleUpdate}
        userPosted={userPosted}
        initialData={initialData}
      />

      <Prefix
        prefix={terminologyData.prefix[0]}
        setPrefix={(value) =>
          handleUpdate({
            key: 'prefix',
            data: [value, true],
          })
        }
        validatePrefixMutation={useGetIfNamespaceInUseMutation}
        typeInUri={'terminology'}
        error={false}
        translations={{
          automatic: t('automatic-prefix'),
          errorInvalid: t('prefix-invalid'),
          errorTaken: t('prefix-taken'),
          hintText: t('prefix-hint'),
          label: t('prefix'),
          manual: t('manual-prefix'),
          textInputHint: '',
          textInputLabel: t('prefix'),
          uriPreview: t('url-preview'),
        }}
        invertCheck
      />

      <TallerSeparator />
      <ContactInfo
        disabled={disabled}
        update={handleUpdate}
        userPosted={userPosted}
        defaultValue={initialData?.contact}
      />
    </form>
  );
}
