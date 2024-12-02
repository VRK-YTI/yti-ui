import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import isEmail from 'validator/lib/isEmail';
import { TerminologyForm } from './info-manual';

interface MissingInfoAlertProps {
  data: TerminologyForm;
}

export default function MissingInfoAlert({ data }: MissingInfoAlertProps) {
  const { t } = useTranslation('admin');
  const render = renderAlert();

  if (!data || !render) {
    return null;
  }

  if (render) {
    return (
      <FormFooterAlert
        labelText={t('missing-information')}
        alerts={[
          ...renderLanguageAlerts(),
          renderOrganizationAlerts(),
          renderInformationDomainAlerts(),
          renderPrefixAlerts(),
          renderStatusAlerts(),
          renderContactAlerts(),
        ].filter((alert) => alert)}
      />
    );
  } else {
    return <></>;
  }

  function renderAlert() {
    if (
      data.languages.length === 0 ||
      data.languages.some((l) => !l.title) ||
      data.organizations.length === 0 ||
      data.groups.length === 0 ||
      !data.prefix[0] ||
      data.prefix[1] === false ||
      (Object.keys(data).includes('status') && !data.status) ||
      (data.contact && !isEmail(data.contact))
    ) {
      return true;
    }
  }

  function renderLanguageAlerts(): string[] {
    const returnList = [];

    if (data.languages.length === 0) {
      returnList.push(t('alert-description-languages-undefined'));
    }

    data.languages
      .filter((lang) => !lang.title)
      .forEach((lang) =>
        returnList.push(
          `${t('alert-description-name-undefined')} ${translateLanguage(
            lang.uniqueItemId,
            t
          )}`
        )
      );

    return returnList;
  }

  function renderOrganizationAlerts(): string {
    if (data.organizations.length === 0) {
      return t('alert-org-undefined');
    }
    return '';
  }

  function renderInformationDomainAlerts(): string {
    if (data.groups.length === 0) {
      return t('alert-information-domain-undefined');
    }

    return '';
  }

  function renderPrefixAlerts(): string {
    if (!data.prefix[0]) {
      return t('alert-prefix-undefined');
    }

    if (data.prefix[1] === false) {
      return t('alert-prefix-invalid-or-in-use');
    }

    return '';
  }

  function renderStatusAlerts(): string {
    if (Object.keys(data).includes('status') && !data.status) {
      return t('alert-no-status');
    }

    return '';
  }

  function renderContactAlerts(): string {
    if (data.contact && !isEmail(data.contact)) {
      return t('alert-invalid-email');
    }

    return '';
  }
}
