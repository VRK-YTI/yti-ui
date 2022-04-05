import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { InlineAlert } from 'suomifi-ui-components';
import { MissingInfoAlertUl } from './new-terminology.styles';

interface MissingInfoAlertProps {
  data: NewTerminologyInfo;
}

export default function MissingInfoAlert({ data }: MissingInfoAlertProps) {
  console.log('data', data);

  if (!data) {
    return null;
  }

  return (
    <InlineAlert status='warning'>
      Puttuvia tietoja:
      <MissingInfoAlertUl>
        {renderDescriptionAlerts()}
        {renderOrganizationAlerts()}
        {renderInformationDomainAlerts()}
        {renderPrefixAlerts()}
        {renderContactAlerts()}
      </MissingInfoAlertUl>
    </InlineAlert>
  );

  function renderDescriptionAlerts() {
    return (
      <>
        {
          data.description[0].length === 0 &&
          <li>
            Sanaston kieliä ei ole määritelty
          </li>
        }
        {
          data.description[0]
            .filter(desc => !desc.name)
            .map((desc, idx) => {
              return (
                <li key={`description-${idx}`}>
                  Sanaston nimi puuttuu kieleltä {desc.lang}
                </li>
              );
            })
        }
      </>
    );
  }

  function renderOrganizationAlerts() {
    return (
      <>
        {
          !data.mainOrg
          &&
          <li>
            Sisällöntuottajaa ei ole määritelty
          </li>
        }
      </>
    );
  }

  function renderInformationDomainAlerts() {
    return (
      <>
      {
        data.infoDomains.length === 0
        &&
        <li>
          Tietoaluetta ei määritelty
        </li>
      }
      </>
    );
  }

  function renderPrefixAlerts() {
    return (
      <>
      {
        !data.prefix[0]
        &&
        <li>
          Tunnusta ei ole määritelty
        </li>
      }
      {
        data.prefix[1] === false
        &&
        <li>
          Tunnus ei ole oikeassa muodossa tai se on jo käytössä
        </li>
      }
      </>
    );
  }

  function renderContactAlerts() {
    return (
      <>
      {
        !data.contact?.[0]
        &&
        <li>
          Yhteynotto-osoitetta ei ole määritelty
        </li>
      }
      {
        data.contact?.[1] === false
        &&
        <li>
          Yhteydenotto-osoite ei ole oikeassa muodossa
        </li>
      }
      </>
    );
  }

}
