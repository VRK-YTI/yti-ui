import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Checkbox, Dropdown, DropdownItem, ModalFooter, ModalTitle, Paragraph, Text } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import { OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { setAlert } from '../alert/alert.slice';
import { selectLogin } from '../login/login-slice';
import { useBreakpoints } from '../media-query/media-query-context';
import { useGetRequestsQuery } from './access-request.slice';
import { AccessRequestDescription, AccessRequestModal, AccessRequestModalContent, CheckboxTitle, CheckboxWrapper, ModalButton, ModalContentBlock, Title } from './access-request.styles';

interface AccessRequestProps {
  organizations?: OrganizationSearchResult[];
}

const TERMINOLOGY = 'TERMINOLOGY_EDITOR';
const CODE_LIST = 'CODE_LIST_EDITOR';
const DATA_MODEL = 'DATA_MODEL_EDITOR';
const SERVICES_INITIAL_STATE = {
  TERMINOLOGY_EDITOR: false,
  CODE_LIST_EDITOR: false,
  DATA_MODEL_EDITOR: false
};

export default function AccessRequest({ organizations }: AccessRequestProps) {
  const { t } = useTranslation('own-information');
  const { isSmall } = useBreakpoints();
  const user = useSelector(selectLogin());
  const { data: requests, refetch } = useGetRequestsQuery(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<any>({});
  const [chosenOrganization, setChosenOrganization] = useState<string>();
  const [services, setServices] = useState<{ [key: string]: boolean }>(SERVICES_INITIAL_STATE);
  const dispatch = useStoreDispatch();

  const handleClose = () => {
    setChosenOrganization('');
    setVisible(false);
    setServices(SERVICES_INITIAL_STATE);
    setError({});
  };

  const handleCheckbox = (key: string, bool: boolean) => {
    const temp = Object.assign({}, services);
    temp[key] = bool;
    setServices(temp);
    if (error && !error['dropdown']) {
      setError({});
    }
  };

  const handleClick = () => {
    if (!chosenOrganization) {
      setError({ 'dropdown': true });
      return;
    }

    if (!Object.keys(services).find(key => services[key])) {
      setError({ 'checkbox': true });
      return;
    }

    const pendingRequestsForOrg = requests.filter(request => request.organizationId === chosenOrganization)?.[0]?.role ?? [];
    const currentRightsForOrg = user.rolesInOrganizations[Object.keys(user.rolesInOrganizations)
      .filter(org => org === chosenOrganization)?.[0]];
    const relatedRights = [...new Set([...pendingRequestsForOrg, ...currentRightsForOrg])];

    let currentRights = {};
    Object.keys(services).filter(key => services[key]).map(service => {
      if (relatedRights.includes(service)) {
        currentRights[service] = true;
      }
    });

    if (Object.keys(currentRights).length > 0) {
      setError(currentRights);
      return;
    }

    let uri = `/terminology-api/api/v1/frontend/request?organizationId=${chosenOrganization}`;
    Object.keys(services).map(key => {
      if (services[key]) {
        uri += `&roles=${key}`;
      }
    });

    if (process.env.NODE_ENV === 'development') {
      uri += '&fake.login.mail=admin@localhost';
    }

    axios.post(uri)
      .then(() => {
        // TODO: change data text to use translation
        dispatch(setAlert([{ status: 0, data: 'Käyttöoikeuspyyntö lähetetty' }]));
        refetch();
        handleClose();
      }).catch(err => {
        dispatch(setAlert([{ status: err.response.status, data: err.response.statusText }]));
        refetch();
        handleClose();
      });
  };

  return (
    <>
      <Title>
        {t('access-request')}
      </Title>

      <AccessRequestDescription>
        {t('access-description')}
      </AccessRequestDescription>

      <ModalButton
        variant='secondary'
        icon='message'
        onClick={() => setVisible(true)}
      >
        {t('access-request-access')}
      </ModalButton>

      <AccessRequestModal
        appElementId='__next'
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => handleClose()}
      >
        <AccessRequestModalContent>
          <ModalTitle>
            {t('access-request-access')}
          </ModalTitle>
          <Paragraph>
            <Text>
              {t('access-org-description')}
            </Text>
          </Paragraph>

          <ModalContentBlock>
            <Dropdown
              labelText={t('access-organization')}
              visualPlaceholder={t('access-pick-org')}
              value={chosenOrganization}
              onChange={e => setChosenOrganization(e)}
            >
              {organizations?.map((organization, idx) => {
                return (
                  <DropdownItem
                    value={organization.id}
                    key={`dropdown-item-${idx}`}
                  >
                    {organization.properties.prefLabel.value}
                  </DropdownItem>
                );
              })}
            </Dropdown>
          </ModalContentBlock>

          <ModalContentBlock>
            <CheckboxWrapper>
              <CheckboxTitle>{t('access-services')}</CheckboxTitle>
              <Checkbox
                checked={services[TERMINOLOGY]}
                onClick={e => handleCheckbox(TERMINOLOGY, e.checkboxState)}
                status={(error?.['checkbox'] || error?.[TERMINOLOGY]) ? 'error' : 'default'}
                statusText={error?.[TERMINOLOGY] && 'Olet pyytänyt jo oikeutta tähän palveluun'}
                variant={isSmall ? 'large' : 'small'}
              >
                {t('access-terminology')}
              </Checkbox>
              <Checkbox
                checked={services[CODE_LIST]}
                onClick={e => handleCheckbox(CODE_LIST, e.checkboxState)}
                status={(error?.['checkbox'] || error?.[CODE_LIST]) ? 'error' : 'default'}
                statusText={error?.[CODE_LIST] && 'Olet pyytänyt jo oikeutta tähän palveluun'}
                variant={isSmall ? 'large' : 'small'}
              >
                {t('access-reference-data')}
              </Checkbox>
              <Checkbox
                checked={services[DATA_MODEL]}
                onClick={e => handleCheckbox(DATA_MODEL, e.checkboxState)}
                status={error?.['checkbox'] ? 'error' : 'default'}
                statusText={(error?.['checkbox'] && 'Valitse vähintään yksi palvelu')
                  ||
                  (error[DATA_MODEL] && 'Olet pyytänyt jo oikeutta tähän palveluun')
                }
                variant={isSmall ? 'large' : 'small'}
              >
                {t('access-data-vocabularies')}
              </Checkbox>
            </CheckboxWrapper>
          </ModalContentBlock>
        </AccessRequestModalContent>

        <ModalFooter>
          <Button onClick={() => handleClick()}>
            {t('access-send-request')}
          </Button>
          <Button
            variant='secondary'
            onClick={() => handleClose()}
          >
            {t('access-cancel')}
          </Button>
        </ModalFooter>
      </AccessRequestModal>
    </>
  );
};
