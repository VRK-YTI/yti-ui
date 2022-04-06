import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { useTranslation } from 'next-i18next';
import { InlineAlert } from 'suomifi-ui-components';
import { MissingInfoAlertUl } from './new-terminology.styles';

interface MissingInfoAlertProps {
  data: NewTerminologyInfo;
}

export default function MissingInfoAlert({ data }: MissingInfoAlertProps) {
  const { t } = useTranslation('admin');
  const renderCheck = renderAlert();
  if (!data || !renderCheck) {
    return null;
  }

  if (renderCheck) {
    return (
      <InlineAlert status="warning" role="alert">
        {t('alert-missing-information')}:
        <MissingInfoAlertUl>
          {renderDescriptionAlerts()}
          {renderOrganizationAlerts()}
          {renderInformationDomainAlerts()}
          {renderPrefixAlerts()}
          {renderContactAlerts()}
        </MissingInfoAlertUl>
      </InlineAlert>
    );
  } else {
    return <></>;
  }

  function renderAlert() {
    if (
      data.description[0].length === 0 ||
      !data.mainOrg ||
      data.infoDomains.length === 0 ||
      !data.prefix[0] ||
      data.prefix[1] === false ||
      !data.contact?.[0] ||
      data.contact?.[1] === false
    ) {
      return true;
    }
  }

  function renderDescriptionAlerts() {
    return (
      <>
        {data.description[0].length === 0 && (
          <li>{t('alert-description-languages-undefined')}</li>
        )}
        {data.description[0]
          .filter((desc) => !desc.name)
          .map((desc, idx) => {
            return (
              <li key={`description-${idx}`}>
                {t('alert-description-name-undefined')} {t(desc.lang)}
              </li>
            );
          })}
      </>
    );
  }

  function renderOrganizationAlerts() {
    return <>{!data.mainOrg && <li>{t('alert-main-org-undefined')}</li>}</>;
  }

  function renderInformationDomainAlerts() {
    return (
      <>
        {data.infoDomains.length === 0 && (
          <li>{t('alert-information-domain-undefined')}</li>
        )}
      </>
    );
  }

  function renderPrefixAlerts() {
    return (
      <>
        {!data.prefix[0] && <li>{t('alert-prefix-undefined')}</li>}
        {data.prefix[1] === false && (
          <li>{t('alert-prefix-invalid-or-in-use')}</li>
        )}
      </>
    );
  }

  function renderContactAlerts() {
    return (
      <>
        {!data.contact?.[0] && <li>{t('alert-contact-undefined')}</li>}
        {data.contact?.[1] === false && <li>{t('alert-contact-invalid')}</li>}
      </>
    );
  }
}
