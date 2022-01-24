import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, MultiSelect, MultiSelectData, Paragraph, RadioButton, RadioButtonGroup, SingleSelectData, Text } from 'suomifi-ui-components';
import { selectLogin } from '../login/login-slice';
import { useBreakpoints } from '../media-query/media-query-context';
import { getPropertyValue } from '../property-value/get-property-value';
import Separator from '../separator';
import { useGetGroupsQuery, useGetOrganizationsQuery } from '../terminology-search/terminology-search-slice';
import { ContactTextInput, MultiselectSmBot, OrgCheckbox, OrgSingleSelect } from './new-terminology.styles';

export default function InfoManual() {
  const user = useSelector(selectLogin());
  const { isSmall } = useBreakpoints();
  const { i18n } = useTranslation('admin');
  const [selectedLanguages, setSelectedLanguages] = useState<MultiSelectData[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<SingleSelectData | null>();
  const [selectedOtherOrganizations, setSelectedOtherOrganizations] = useState<MultiSelectData[]>([]);
  const [selectedInfoDomains, setSelectedInfoDomains] = useState<MultiSelectData[]>([]);
  const { data: organizations } = useGetOrganizationsQuery(null);
  const { data: informationDomains } = useGetGroupsQuery(null);

  const [showOtherOrgSelector, setShowOtherOrgSelector] = useState<boolean>(false);

  const languages = [
    {
      name: 'Suomi',
      labelText: 'Suomi',
      uniqueItemId: 'fi'
    },
    {
      name: 'Englanti',
      labelText: 'Enlanti',
      uniqueItemId: 'en'
    },
    {
      name: 'Ruotsi',
      labelText: 'Ruotsi',
      uniqueItemId: 'sv'
    }
  ];

  return (
    <>
      <Separator />
      {renderLanguagesSelector()}
      <Separator />
      <Paragraph marginBottomSpacing='m'>
        <Text variant='bold'>Sanaston muut tiedot</Text>
      </Paragraph>
      {renderOrganizationSelector()}
      {renderTerminologyTypeSelector()}
      {renderInformationDomainsSelector()}
      {renderPrefix()}
      <Separator />
      {renderContactInfo()}
    </>
  );

  function renderLanguagesSelector() {
    return (
      <>
        <Paragraph marginBottomSpacing='m'>
          <Text variant='bold'>Sanaston kielet</Text>
        </Paragraph>

        <Paragraph marginBottomSpacing='m'>
          <Text>
            Valitse sanastolle kielet, joilla sanaston sisältö on kuvattu.
            Anna myös sanaston nimi ja kuvaus valituilla kielillä.
          </Text>
        </Paragraph>

        <MultiselectSmBot
          labelText='Sanaston kielet'
          items={languages}
          chipListVisible={true}
          ariaChipActionLabel="Remove"
          ariaSelectedAmountText="languages selected"
          ariaOptionsAvailableText="options available"
          ariaOptionChipRemovedText="removed"
          noItemsText='no items'
          visualPlaceholder='Valitse sanaston kielet'
          onItemSelectionsChange={(e) => setSelectedLanguages(e)}
          isSmall={isSmall}
        />
      </>
    );
  }

  function renderOrganizationSelector() {
    const adminOrgs: SingleSelectData[] = organizations?.map(org => {
      if (user.organizationsInRole.ADMIN.includes(org.id.toString())) {
        const orgName = getPropertyValue({ property: org.properties.prefLabel, language: i18n.language }) ?? '';

        if (orgName) {
          return {
            'name': orgName,
            'labelText': orgName,
            'uniqueItemId': org.id
          } as SingleSelectData;
        }
      }
    }) as SingleSelectData[];

    const handleSelectOrganization = (value: SingleSelectData | null) => {
      setSelectedOrganization(value);
      if (!value) {
        setShowOtherOrgSelector(false);
        setSelectedOtherOrganizations([]);
      }
    };

    return (
      <>
        {user.organizationsInRole.ADMIN.length > 1
          ?
          <>
            <OrgSingleSelect
              labelText='Sisällöntuottaja'
              hintText='Voit lisätä vain organisaation, joka on antanut sinulle muokkausoikeudet'
              ariaOptionsAvailableText='Options available'
              clearButtonLabel='Tyhjennä'
              isSmall={isSmall}
              items={adminOrgs}
              onItemSelectionChange={item => handleSelectOrganization(item)}
              noItemsText='no items'
            />
            <OrgCheckbox
              checked={showOtherOrgSelector}
              onClick={(value) => setShowOtherOrgSelector(value.checkboxState)}
            >
              Lisää muut vastuuorganisaatiot
            </OrgCheckbox>
            {showOtherOrgSelector &&
              <MultiselectSmBot
                labelText='Muut vastuuorganisaatiot'
                items={adminOrgs
                  .filter(adminOrgs => adminOrgs.uniqueItemId !== selectedOrganization?.uniqueItemId)
                }
                chipListVisible={true}
                ariaChipActionLabel="Remove"
                ariaSelectedAmountText="organizations selected"
                ariaOptionsAvailableText="options available"
                ariaOptionChipRemovedText="removed"
                noItemsText='no items'
                visualPlaceholder='Valitse muut vastuuorganisaatiot'
                onItemSelectionsChange={(e) => { }}
                isSmall={isSmall}
              />
            }
          </>
          :
          <>
            <Paragraph>
              <Text variant='bold' smallScreen>Sisällöntuottaja</Text>
            </Paragraph>
            <Paragraph>
              <Text smallScreen>{adminOrgs[0].labelText}</Text>
            </Paragraph>
          </>
        }

      </>
    );
  }

  function renderTerminologyTypeSelector() {
    return (
      <RadioButtonGroup
        labelText='Sanastotyyppi'
        name='terminology-type'
        defaultValue='terminology'
      >
        <RadioButton value='terminology'>
          Terminologinen sanasto
        </RadioButton>
        <RadioButton value='other'>
          Muu sanasto
        </RadioButton>
      </RadioButtonGroup>
    );
  }

  function renderInformationDomainsSelector() {
    const infoDomains: MultiSelectData[] = informationDomains?.map(infoDomain => {
      const domainName = getPropertyValue({ property: infoDomain.properties.prefLabel, language: i18n.language }) ?? '';

      if (domainName) {
        return {
          'name': domainName,
          'labelText': domainName,
          'uniqueItemId': infoDomain.id
        } as MultiSelectData;
      }
    }) as MultiSelectData[];

    return (
      <>
        <MultiselectSmBot
          labelText='Tietoalueet'
          hintText='Valitse sanastolle sen sisältöä kuvaavat tietoalueet. Tietoalue auttaa sanaston löydettävyydessä.'
          items={infoDomains}
          chipListVisible={true}
          ariaChipActionLabel="Remove"
          ariaSelectedAmountText="languages selected"
          ariaOptionsAvailableText="options available"
          ariaOptionChipRemovedText="removed"
          noItemsText='no items'
          visualPlaceholder='Valitse sanaston aihealueet'
          onItemSelectionsChange={(e) => setSelectedInfoDomains(e)}
          isSmall={isSmall}
        />
      </>
    );
  }

  function renderPrefix() {

    return (
      <>
        <RadioButtonGroup
          labelText='Tunnus'
          hintText='Sanaston yksilöivä tunnus, jota ei voi muuttaa sanaston luonnin jälkeen.'
          name='prefix'
          defaultValue='automatic'
        >
          <RadioButton value='automatic'>
            Luo tunnus automaattisesti
          </RadioButton>
          <RadioButton value='manual'>
            Valitse oma tunnus
          </RadioButton>
        </RadioButtonGroup>
        <Paragraph>
          <Text variant='bold' smallScreen>
            Url:n esikatselu
          </Text>
        </Paragraph>
        <Paragraph>
          <Text smallScreen>
            http://uri.suomi.fi/terminology/abcd5678
          </Text>
        </Paragraph>
      </>
    );
  }

  function renderContactInfo() {
    return (
      <>
        <Paragraph>
          <Text variant='bold'>
            Yhteydenottotiedot
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>
            Organisaation yleinen sähköpostiosoite, johon käyttäjä voi antaa palautetta sanaston sisältöön liittyen. Älä käytä henkilökohtaista sähköpostiosoitetta.
          </Text>
        </Paragraph>
        <ContactTextInput
          labelText='Yhteydenotto-osoite'
          hintText='Sanaston tiedoissa julkisesti näkyvä sähköpostiosoite.'
          visualPlaceholder='Esim. yllapito@example.org'
          isSmall={isSmall}
        />
      </>
    );
  }

}
