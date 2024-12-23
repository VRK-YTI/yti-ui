import { i18n, useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DropdownItem,
  Modal,
  ModalContent,
  ModalFooter,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { selectLogin } from '../login/login.slice';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { AccessRequest } from './access-request.interface';
import {
  AccessRequestDropdown,
  ModalContentBlock,
  ModalTitleH1,
} from './access-request.styles';
import { Organization } from 'yti-common-ui/interfaces/organization.interface';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

export interface AccessRequestModalProps {
  visible: boolean;
  handleClose: () => void;
  organizations?: Organization[];
  requests?: AccessRequest[];
  postRequest: (value: string) => void;
}

const TERMINOLOGY = 'TERMINOLOGY_EDITOR';
const CODE_LIST = 'CODE_LIST_EDITOR';
const DATA_MODEL = 'DATA_MODEL_EDITOR';
const SERVICES_INITIAL_STATE = {
  TERMINOLOGY_EDITOR: false,
  CODE_LIST_EDITOR: false,
  DATA_MODEL_EDITOR: false,
};

export default function AccessRequestModal({
  visible,
  handleClose,
  organizations,
  requests,
  postRequest,
}: AccessRequestModalProps) {
  const { t } = useTranslation('own-information');
  const { isSmall } = useBreakpoints();
  const user = useSelector(selectLogin());
  const [chosenOrganization, setChosenOrganization] = useState<string>();
  const [services, setServices] = useState<{ [key: string]: boolean }>(
    SERVICES_INITIAL_STATE
  );
  const [error, setError] = useState<{ [key: string]: boolean }>({});

  const handleCloseModal = () => {
    setChosenOrganization('');
    setServices(SERVICES_INITIAL_STATE);
    setError({});
    handleClose();
  };

  const handleClick = () => {
    if (!chosenOrganization) {
      setError({ dropdown: true });
      return;
    }

    if (!Object.keys(services).find((key) => services[key])) {
      setError({ checkbox: true });
      return;
    }

    const currentRights = getCurrentRights();
    if (Object.keys(currentRights).length > 0) {
      setError(currentRights);
      return;
    }

    sendPost();
  };

  const handleCheckbox = (key: string, bool: boolean) => {
    const temp = Object.assign({}, services);
    temp[key] = bool;
    setServices(temp);
    if (error && !error['dropdown']) {
      setError({});
    }
  };

  if (!visible) {
    return <></>;
  }

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      variant={isSmall ? 'smallScreen' : 'default'}
      onEscKeyDown={() => handleCloseModal()}
      scrollable={false}
      className="access-request-modal"
    >
      <ModalContent>
        <ModalTitleH1 as="h1">{t('access-request-access')}</ModalTitleH1>
        <Paragraph>
          <Text>{t('access-org-description')}</Text>
        </Paragraph>

        <ModalContentBlock>
          <AccessRequestDropdown
            $error={error?.['dropdown']}
            labelText={t('access-organization')}
            visualPlaceholder={t('access-pick-org')}
            value={chosenOrganization}
            onChange={(e) => {
              setChosenOrganization(e), setError({});
            }}
            id="organization-selector"
          >
            {organizations?.map((organization, idx) => {
              return (
                <DropdownItem
                  value={organization.id}
                  key={`dropdown-item-${idx}`}
                >
                  {getLanguageVersion({
                    data: organization.label,
                    lang: i18n?.language ?? 'fi',
                  })}
                </DropdownItem>
              );
            })}
          </AccessRequestDropdown>
        </ModalContentBlock>

        <ModalContentBlock>
          <CheckboxGroup labelText={t('access-services')} id="service-selector">
            <Checkbox
              checked={services[TERMINOLOGY]}
              onClick={(e) => handleCheckbox(TERMINOLOGY, e.checkboxState)}
              status={
                error?.['checkbox'] || error?.[TERMINOLOGY]
                  ? 'error'
                  : 'default'
              }
              statusText={
                error?.[TERMINOLOGY] ? t('access-request-already-sent') : ''
              }
              variant={isSmall ? 'large' : 'small'}
              id="service-terminology"
            >
              {t('access-terminology')}
            </Checkbox>
            <Checkbox
              checked={services[CODE_LIST]}
              onClick={(e) => handleCheckbox(CODE_LIST, e.checkboxState)}
              status={
                error?.['checkbox'] || error?.[CODE_LIST] ? 'error' : 'default'
              }
              statusText={
                error?.[CODE_LIST] ? t('access-request-already-sent') : ''
              }
              variant={isSmall ? 'large' : 'small'}
              id="service-code-list"
            >
              {t('access-reference-data')}
            </Checkbox>
            <Checkbox
              checked={services[DATA_MODEL]}
              onClick={(e) => handleCheckbox(DATA_MODEL, e.checkboxState)}
              status={
                error?.['checkbox'] || error?.[DATA_MODEL] ? 'error' : 'default'
              }
              statusText={
                (error?.['checkbox'] && t('access-pick-at-least-one')) ||
                (error[DATA_MODEL] && t('access-request-already-sent')) ||
                ''
              }
              variant={isSmall ? 'large' : 'small'}
              id="service-data-model"
            >
              {t('access-data-vocabularies')}
            </Checkbox>
          </CheckboxGroup>
        </ModalContentBlock>
      </ModalContent>

      <ModalFooter id="modal-footer">
        <Button onClick={() => handleClick()} id="submit-button">
          {t('access-send-request')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleCloseModal()}
          id="cancel-button"
        >
          {t('access-cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );

  function sendPost() {
    let uri = `/requests?organizationId=${chosenOrganization}`;

    Object.keys(services).map((key) => {
      if (services[key]) {
        uri += `&roles=${key}`;
      }
    });

    if (process.env.NODE_ENV === 'development') {
      uri += '&fake.login.mail=admin@localhost';
    }

    postRequest(uri);
  }

  function getCurrentRights() {
    const pendingRequestsForOrg =
      requests?.filter(
        (request) => request.organizationId === chosenOrganization
      )?.[0]?.role ?? [];

    const currentRightsForOrg =
      user?.rolesInOrganizations[
        Object.keys(user.rolesInOrganizations).filter(
          (org) => org === chosenOrganization
        )?.[0] ?? ''
      ] ?? [];

    const relatedRights: string[] = Array.from(
      new Set([...pendingRequestsForOrg, ...currentRightsForOrg])
    );

    const currentRights: { [key: string]: boolean } = {};
    Object.keys(services)
      .filter((key) => services[key])
      .map((service) => {
        if (relatedRights.includes(service)) {
          currentRights[service] = true;
        }
      });

    return currentRights;
  }
}
