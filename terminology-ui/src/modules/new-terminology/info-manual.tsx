import { useEffect, useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import ContactInfo from '@app/common/components/terminology-components/contact-info';
import InformationDomainsSelector from '@app/common/components/terminology-components/information-domains-selector';
import { TallerSeparator } from './new-terminology.styles';
import OrganizationSelector from '@app/common/components/terminology-components/organization-selector';
import Prefix from 'yti-common-ui/form/prefix';
import TypeSelector from '@app/common/components/terminology-components/type-selector';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { useTranslation } from 'next-i18next';
import { TerminologyDataInitialState } from './terminology-initial-state';
import { UpdateTerminology } from './update-terminology.interface';
import StatusSelector from './status-selector';
import isEmail from 'validator/lib/isEmail';
import { useGetIfNamespaceInUseMutation } from '@app/common/components/vocabulary/vocabulary.slice';
import LanguageSelector, {
  LanguageBlockType,
} from 'yti-common-ui/form/language-selector';
import { useGetCodesQuery } from '@app/common/components/codelist/codelist.slice';

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
  const { t, i18n } = useTranslation('admin');
  const [terminologyData, setTerminologyData] = useState<NewTerminologyInfo>(
    initialData ? initialData : TerminologyDataInitialState
  );
  const { data: languages } = useGetCodesQuery({
    registry: 'interoperabilityplatform',
    codeScheme: 'languagecodes',
  });
  const [languageList, setLanguageList] = useState<LanguageBlockType[]>([]);

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

        if (
          key === 'languages' &&
          (!value ||
            value.length < 1 ||
            value.some((v: LanguageBlockType) => !v.title))
        ) {
          valid = false;
        }
      });
    }
    setIsValid(valid);
    setManualData(terminologyData);
  }, [terminologyData, setIsValid, setManualData, languages]);

  useEffect(() => {
    const selectedLangCodes =
      initialData?.languages.map((d) => d.uniqueItemId) ?? [];

    const langResult = languages?.results.map((r) => {
      const labelText = `${
        r.prefLabel[i18n.language]
      } ${r.codeValue.toUpperCase()}`;

      if (selectedLangCodes.includes(r.codeValue)) {
        const selectedLang = initialData?.languages?.find(
          (d) => d.uniqueItemId === r.codeValue
        );
        return {
          labelText,
          uniqueItemId: r.codeValue,
          title: selectedLang?.title ?? '',
          description: selectedLang?.description ?? '',
          selected: true,
        };
      } else {
        return {
          labelText,
          uniqueItemId: r.codeValue,
          title: '',
          description: '',
          selected: false,
        };
      }
    });

    if (langResult) {
      const promotedOrder = ['fi', 'sv', 'en'];
      const promoted: LanguageBlockType[] = [];
      const otherLanguages = langResult.reduce((langList, lang) => {
        promotedOrder.includes(lang.uniqueItemId)
          ? promoted.push(lang)
          : langList.push(lang);
        return langList;
      }, [] as LanguageBlockType[]);

      promoted.sort(
        (a, b) =>
          promotedOrder.indexOf(a.uniqueItemId) -
          promotedOrder.indexOf(b.uniqueItemId)
      );
      setLanguageList([...promoted, ...otherLanguages]);
    }
  }, [languages, i18n, initialData]);

  const handleUpdate = ({ key, data }: UpdateTerminology) => {
    setTerminologyData((values) => ({ ...values, [key]: data }));
    onChange();
  };

  return (
    <form>
      <LanguageSelector
        items={languageList}
        labelText={t('information-description-languages')}
        hintText={t('information-description-languages-hint-text')}
        visualPlaceholder={t('select-information-description-languages')}
        isWide={true}
        defaultSelectedItems={initialData?.languages}
        setLanguages={(value) => {
          const selectedItems = value.filter((v) => v.selected);
          const selectedIds = selectedItems.map((i) => i.uniqueItemId);
          const updatedList = languageList.map((item) => {
            if (selectedIds.includes(item.uniqueItemId)) {
              const selected = selectedItems.find(
                (v) => v.uniqueItemId === item.uniqueItemId
              );
              return {
                ...item,
                title: selected?.title ?? '',
                description: selected?.description ?? '',
                selected: true,
              };
            }
            return {
              ...item,
              selected: false,
            };
          });

          setLanguageList(updatedList);
          handleUpdate({
            key: 'languages',
            data: selectedItems,
          });
        }}
        userPosted={userPosted}
        translations={{
          textInput: t('language-input-text'),
          textDescription: t('description'),
          optionalText: t('optional'),
        }}
        allowItemAddition={false}
        ariaChipActionLabel={''}
        ariaSelectedAmountText={''}
        ariaOptionsAvailableText={''}
        ariaOptionChipRemovedText={''}
        noItemsText={''}
        disabled={disabled}
      />
      <TallerSeparator />
      <Paragraph mb="m">
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
        inUseMutation={useGetIfNamespaceInUseMutation}
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
