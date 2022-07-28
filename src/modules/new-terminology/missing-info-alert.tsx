import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { translateLanguage } from '@app/common/utils/translation-helpers';
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
      data.description[0].some((d) => !d.name) ||
      !data.mainOrg ||
      data.infoDomains.length === 0 ||
      !data.prefix[0] ||
      data.prefix[1] === false
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
                {t('alert-description-name-undefined')}{' '}
                {translateLanguage(desc.lang, t)}
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
    if (!data.prefix[0]) {
      return <li>{t('alert-prefix-undefined')}</li>;
    }

    if (data.prefix[1] === false) {
      return <li>{t('alert-prefix-invalid-or-in-use')}</li>;
    }

    return <></>;
  }

  function renderContactAlerts() {
    return (
      <>
        {data.contact?.[1] === false && <li>{t('alert-contact-invalid')}</li>}
      </>
    );
  }
}
