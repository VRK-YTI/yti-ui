import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Checkbox, DropdownItem, ModalFooter, ModalTitle, Paragraph, Text } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import { OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { setAlert } from '../alert/alert.slice';
import { selectLogin } from '../login/login-slice';
import { useBreakpoints } from '../media-query/media-query-context';
import { useGetRequestsQuery } from './access-request.slice';
import {
  AccessRequestDescription,
  AccessRequestModal,
  AccessRequestModalContent,
  AccessRequstDropdown,
  CheckboxTitle,
  CheckboxWrapper,
  ModalButton,
  ModalContentBlock,
  Title
} from './access-request.styles';

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
  const [error, setError] = useState<{ [key: string]: boolean }>({});
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

    // Creating list of current and pending rights for the user
    const pendingRequestsForOrg = requests?.filter(request => request.organizationId === chosenOrganization)?.[0]?.role ?? [];
    const currentRightsForOrg = user.rolesInOrganizations[Object.keys(user.rolesInOrganizations)
      .filter(org => org === chosenOrganization)?.[0]];
    const relatedRights: string[] = Array.from(new Set([...pendingRequestsForOrg, ...currentRightsForOrg]));

    const currentRights: { [key: string]: boolean } = {};
    Object.keys(services).filter(key => services[key]).map(service => {
      if (relatedRights.includes(service)) {
        currentRights[service] = true;
      }
    });

    if (Object.keys(currentRights).length > 0) {
      setError(currentRights);
      return;
    }

    sendPost();
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
            <AccessRequstDropdown
              error={error?.['dropdown']}
              labelText={t('access-organization')}
              visualPlaceholder={t('access-pick-org')}
              value={chosenOrganization}
              onChange={e => { setChosenOrganization(e), setError({}); }}
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
            </AccessRequstDropdown>
          </ModalContentBlock>

          <ModalContentBlock>
            <CheckboxWrapper>
              <CheckboxTitle>{t('access-services')}</CheckboxTitle>
              <Checkbox
                checked={services[TERMINOLOGY]}
                onClick={e => handleCheckbox(TERMINOLOGY, e.checkboxState)}
                status={(error?.['checkbox'] || error?.[TERMINOLOGY]) ? 'error' : 'default'}
                statusText={error?.[TERMINOLOGY] ? t('access-request-already-sent') : ''}
                variant={isSmall ? 'large' : 'small'}
              >
                {t('access-terminology')}
              </Checkbox>
              <Checkbox
                checked={services[CODE_LIST]}
                onClick={e => handleCheckbox(CODE_LIST, e.checkboxState)}
                status={(error?.['checkbox'] || error?.[CODE_LIST]) ? 'error' : 'default'}
                statusText={error?.[CODE_LIST] ? t('access-request-already-sent') : ''}
                variant={isSmall ? 'large' : 'small'}
              >
                {t('access-reference-data')}
              </Checkbox>
              <Checkbox
                checked={services[DATA_MODEL]}
                onClick={e => handleCheckbox(DATA_MODEL, e.checkboxState)}
                status={error?.['checkbox'] ? 'error' : 'default'}
                statusText={
                  (error?.['checkbox'] && t('access-pick-at-least-one'))
                  ||
                  (error[DATA_MODEL] && t('access-request-already-sent'))
                  || ''
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

  function sendPost() {
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
      dispatch(setAlert([{ status: 0, data: t('access-request-sent') }]));
      refetch();
      handleClose();
    }).catch(err => {
      dispatch(setAlert([{ status: err.response.status, data: err.response.statusText }]));
      refetch();
      handleClose();
    });
  };
};
