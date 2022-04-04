import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Checkbox,
  DropdownItem,
  ModalFooter,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import { Error } from '../../interfaces/error.interface';
import { OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { setAlert } from '../alert/alert.slice';
import { selectLogin } from '../login/login.slice';
import { useBreakpoints } from '../media-query/media-query-context';
import {
  useGetRequestsQuery,
  usePostRequestMutation,
} from './access-request.slice';
import {
  AccessRequestDescription,
  AccessRequestModal,
  AccessRequestModalContent,
  AccessRequstDropdown,
  CheckboxTitle,
  CheckboxWrapper,
  ModalButton,
  ModalContentBlock,
  ModalTitleH1,
  Title,
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
  DATA_MODEL_EDITOR: false,
};

export default function AccessRequest({ organizations }: AccessRequestProps) {
  const { t } = useTranslation('own-information');
  const { isSmall } = useBreakpoints();
  const user = useSelector(selectLogin());
  const { data: requests, refetch } = useGetRequestsQuery(null);
  const [postRequest, request] = usePostRequestMutation();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<{ [key: string]: boolean }>({});
  const [chosenOrganization, setChosenOrganization] = useState<string>();
  const [services, setServices] = useState<{ [key: string]: boolean }>(
    SERVICES_INITIAL_STATE
  );
  const dispatch = useStoreDispatch();

  useEffect(() => {
    if (request.isSuccess) {
      dispatch(setAlert([{ status: 0, data: t('access-request-sent') }]));
      refetch();
      handleClose();
    } else if (request.isError) {
      dispatch(setAlert([request.error as Error]));
      refetch();
      handleClose();
    }
  }, [request, dispatch, refetch, t]);

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
    console.log('In handleClick()');

    console.log('Checking that some organiation is chosen');
    if (!chosenOrganization) {
      setError({ dropdown: true });
      return;
    }

    console.log('Checking that some service is checked');
    if (!Object.keys(services).find((key) => services[key])) {
      setError({ checkbox: true });
      return;
    }

    console.log('Getting currentRights');
    const currentRights = getCurrentRights();
    console.log('Received currentRights:', currentRights);
    console.log(
      'Checking that user doesnt already have rights to requested right'
    );
    if (Object.keys(currentRights).length > 0) {
      setError(currentRights);
      return;
    }

    console.log('Sending POST-request');
    sendPost();
  };

  return (
    <>
      <Title>{t('access-request')}</Title>

      <AccessRequestDescription>
        {t('access-description')}
      </AccessRequestDescription>

      <ModalButton
        variant="secondary"
        icon="message"
        onClick={() => setVisible(true)}
      >
        {t('access-request-access')}
      </ModalButton>

      <AccessRequestModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => handleClose()}
      >
        <AccessRequestModalContent>
          <ModalTitleH1 as="h1">{t('access-request-access')}</ModalTitleH1>
          <Paragraph>
            <Text>{t('access-org-description')}</Text>
          </Paragraph>

          {console.log('!!!!CHOSEN ORGANIZATION:', chosenOrganization, '!!!!!')}

          <ModalContentBlock>
            <AccessRequstDropdown
              error={error?.['dropdown']}
              labelText={t('access-organization')}
              visualPlaceholder={t('access-pick-org')}
              value={chosenOrganization}
              onChange={(e) => {
                setChosenOrganization(e), setError({});
              }}
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
            <CheckboxTitle>{t('access-services')}</CheckboxTitle>
            <CheckboxWrapper>
              <li>
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
                >
                  {t('access-terminology')}
                </Checkbox>
              </li>
              <li>
                <Checkbox
                  checked={services[CODE_LIST]}
                  onClick={(e) => handleCheckbox(CODE_LIST, e.checkboxState)}
                  status={
                    error?.['checkbox'] || error?.[CODE_LIST]
                      ? 'error'
                      : 'default'
                  }
                  statusText={
                    error?.[CODE_LIST] ? t('access-request-already-sent') : ''
                  }
                  variant={isSmall ? 'large' : 'small'}
                >
                  {t('access-reference-data')}
                </Checkbox>
              </li>
              <li>
                <Checkbox
                  checked={services[DATA_MODEL]}
                  onClick={(e) => handleCheckbox(DATA_MODEL, e.checkboxState)}
                  status={error?.['checkbox'] ? 'error' : 'default'}
                  statusText={
                    (error?.['checkbox'] && t('access-pick-at-least-one')) ||
                    (error[DATA_MODEL] && t('access-request-already-sent')) ||
                    ''
                  }
                  variant={isSmall ? 'large' : 'small'}
                >
                  {t('access-data-vocabularies')}
                </Checkbox>
              </li>
            </CheckboxWrapper>
          </ModalContentBlock>
        </AccessRequestModalContent>

        <ModalFooter>
          <Button onClick={() => handleClick()}>
            {t('access-send-request')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('access-cancel')}
          </Button>
        </ModalFooter>
      </AccessRequestModal>
    </>
  );

  function sendPost() {
    console.log('In sendPost()');

    let uri = `/request?organizationId=${chosenOrganization}`;
    console.log('uri:', uri);

    console.log('services', services);
    Object.keys(services).map((key) => {
      if (services[key]) {
        uri += `&roles=${key}`;
      }
    });

    console.log('uri after services:', uri);

    if (process.env.NODE_ENV === 'development') {
      uri += '&fake.login.mail=admin@localhost';
    }

    postRequest(uri);
  }

  function getCurrentRights() {
    console.log('In getCurrentRights()');

    console.log('Getting pendingRequestsForOrg');
    const pendingRequestsForOrg =
      requests?.filter(
        (request) => request.organizationId === chosenOrganization
      )?.[0]?.role ?? [];

    console.log('pendingRequestsForOrg:', pendingRequestsForOrg);

    console.log('Getting currentRightsForOrg');
    const currentRightsForOrg =
      user?.rolesInOrganizations[
        Object.keys(user.rolesInOrganizations).filter(
          (org) => org === chosenOrganization
        )?.[0] ?? ''
      ] ?? [];

    console.log('currentRightsForOrg:', currentRightsForOrg);

    console.log('Setting relatedRights array');
    const relatedRights: string[] = Array.from(
      new Set([...pendingRequestsForOrg, ...currentRightsForOrg])
    );

    console.log('relatedRights:', relatedRights);

    console.log('Getting currentRights');
    const currentRights: { [key: string]: boolean } = {};
    Object.keys(services)
      .filter((key) => services[key])
      .map((service) => {
        if (relatedRights.includes(service)) {
          currentRights[service] = true;
        }
      });

    console.log('currentRights', currentRights);
    return currentRights;
  }
}
