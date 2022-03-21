import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Checkbox, Dropdown, DropdownItem, ModalFooter, ModalTitle, Paragraph, Text } from 'suomifi-ui-components';
import { OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { useBreakpoints } from '../media-query/media-query-context';
import { useGetRequestsQuery } from './access-request.slice';
import { AccessRequestDescription, AccessRequestModal, AccessRequestModalContent, CheckboxTitle, CheckboxWrapper, ModalButton, ModalContentBlock, Title } from './access-request.styles';

interface AccessRequestProps {
  organizations?: OrganizationSearchResult[];
}

export default function AccessRequest({ organizations }: AccessRequestProps) {
  const { t } = useTranslation('own-information');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [chosenOrganization, setChosenOrganization] = useState<string>();
  const [services, setServices] = useState<{ [key: string]: boolean }>({
    'TERMINOLOGY_DATA': false,
    'CODE_LIST_EDITOR': false,
    'DATA_MODEL_EDITOR': false
  });

  const { data } = useGetRequestsQuery(null);

  const handleClose = () => {
    setChosenOrganization('');
    setVisible(false);
  };

  const handleCheckbox = (key: string, bool: boolean) => {
    const temp = Object.assign({}, services);
    temp[key] = bool;
    setServices(temp);
  };

  console.log('data', data);

  const handleClick = () => {
    const uri = '/terminology-api/api/v1/frontend/request';
    axios.post(`${uri}?organizationId=${chosenOrganization}&fake.login.mail=admin@localhost`)
      .then(response => {
        console.log('response', response);
      }).catch(err => {
        console.error('error', err);
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
              {organizations?.filter(organization => {
                return !data.map(d => d.organizationId).includes(organization.id);
              })
                .map((organization, idx) => {
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
                checked={services['TERMINOLOGY_DATA']}
                onClick={e => handleCheckbox('TERMINOLOGY_DATA', e.checkboxState)}
              >
                {t('access-terminology')}
              </Checkbox>
              <Checkbox
                checked={services['CODE_LIST_EDITOR']}
                onClick={e => handleCheckbox('CODE_LIST_EDITOR', e.checkboxState)}
              >
                {t('access-reference-data')}
              </Checkbox>
              <Checkbox
                checked={services['DATA_MODEL_EDITOR']}
                onClick={e => handleCheckbox('DATA_MODEL_EDITOR', e.checkboxState)}
              >
                {t('access-data-vocabularies')}
              </Checkbox>
            </CheckboxWrapper>
          </ModalContentBlock>

        </AccessRequestModalContent>

        <ModalFooter>
          <Button
            disabled={!chosenOrganization}
            onClick={() => handleClick()}
          >
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
