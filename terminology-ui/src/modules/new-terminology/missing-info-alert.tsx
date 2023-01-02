import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import isEmail from 'validator/lib/isEmail';

interface MissingInfoAlertProps {
  data: NewTerminologyInfo;
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
        alerts={[
          ...renderDescriptionAlerts(),
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
      data.description[0].length === 0 ||
      data.description[0].some((d) => !d.name) ||
      data.contributors.length === 0 ||
      data.infoDomains.length === 0 ||
      !data.prefix[0] ||
      data.prefix[1] === false ||
      (Object.keys(data).includes('status') && !data.status) ||
      (data.contact && !isEmail(data.contact))
    ) {
      return true;
    }
  }

  function renderDescriptionAlerts(): string[] {
    const returnList = [];

    if (data.description[0].length === 0) {
      returnList.push(t('alert-description-languages-undefined'));
    }

    data.description[0]
      .filter((desc) => !desc.name)
      .forEach((desc) =>
        returnList.push(
          `${t('alert-description-name-undefined')} ${translateLanguage(
            desc.lang,
            t
          )}`
        )
      );

    return returnList;
  }

  function renderOrganizationAlerts(): string {
    if (data.contributors.length === 0) {
      return t('alert-org-undefined');
    }
    return '';
  }

  function renderInformationDomainAlerts(): string {
    if (data.infoDomains.length === 0) {
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
