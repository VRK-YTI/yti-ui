import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dropdown,
  DropdownItem,
  IconMessage,
  InlineAlert,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock, BasicBlockExtraWrapper } from '../../components/block';
import { NarrowModal } from './own-information.styles';
import { Organization } from '../../interfaces/organization.interface';
import { useTranslation } from 'next-i18next';
import { Request } from '../../interfaces/request.interface';
import { useBreakpoints } from '../../components/media-query';

interface PermissionModalProps {
  organizations?: Organization[];
  requests?: Request[];
  getLanguageVersion: (value: {
    data: { [key: string]: string };
    lang: string;
    appendLocale?: boolean;
  }) => string;
  postRequest: (value: { organizationId: string; services: string[] }) => void;
  postRequestResult: {
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
  };
  refetchRequests: () => void;
}

export default function PermissionModal({
  organizations,
  requests,
  getLanguageVersion,
  postRequest,
  postRequestResult,
  refetchRequests,
}: PermissionModalProps) {
  const { isSmall } = useBreakpoints();
  const { t, i18n } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    noOrganizations: true,
    noServices: true,
  });

  const orgs = useMemo(() => {
    if (!organizations) {
      return [];
    }

    return organizations.map((org) => ({
      labelText: getLanguageVersion({
        data: org.label,
        lang: i18n.language,
        appendLocale: true,
      }),
      uniqueItemId: org.id,
    }));
  }, [organizations, getLanguageVersion, i18n.language]);

  const handleClose = () => {
    setVisible(false);
    setUserPosted(false);
    setSelectedOrg('');
    setSelectedServices([]);
    setErrors({
      noOrganizations: true,
      noServices: true,
    });
  };

  const handleSubmit = () => {
    if (!userPosted) {
      setUserPosted(true);
    }

    const newErrors = {
      noOrganizations: selectedOrg && selectedOrg !== '' ? false : true,
      noServices:
        selectedServices && selectedServices.length > 0 ? false : true,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).filter(Boolean).length > 0) {
      return;
    }

    postRequest({ organizationId: selectedOrg, services: selectedServices });
  };

  const getDropdownStatus = () => {
    return userPosted && errors.noOrganizations && selectedOrg === ''
      ? 'error'
      : 'default';
  };

  const getCheckboxGroupStatus = () => {
    return errors.noServices && selectedServices.length === 0 && userPosted
      ? 'error'
      : 'default';
  };

  const getIsAlreadyRequested = (key: string) => {
    if (!requests || !selectedOrg || selectedOrg === '') {
      return false;
    }

    return requests
      .find((request) => request.organizationId === selectedOrg)
      ?.role.includes(key)
      ? true
      : false;
  };

  useEffect(() => {
    if (postRequestResult.isSuccess) {
      handleClose();
      refetchRequests();
    }
  }, [postRequestResult, refetchRequests]);

  return (
    <>
      <BasicBlock
        title={t('access-request')}
        extra={
          <BasicBlockExtraWrapper>
            <Button
              variant="secondary"
              icon={<IconMessage />}
              onClick={() => setVisible(true)}
            >
              {t('new-access-request')}
            </Button>
          </BasicBlockExtraWrapper>
        }
      >
        {t('new-access-request-description')}
      </BasicBlock>

      <NarrowModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('new-access-request')}</ModalTitle>

          <Paragraph>
            <Text>{t('access-request-description')}</Text>
          </Paragraph>

          <Dropdown
            labelText={t('organization')}
            visualPlaceholder={t('select-organization')}
            onChange={(value) => setSelectedOrg(value)}
            status={getDropdownStatus()}
          >
            {orgs.map((org) => (
              <DropdownItem key={org.uniqueItemId} value={org.uniqueItemId}>
                {org.labelText}
              </DropdownItem>
            ))}
          </Dropdown>

          <CheckboxGroup
            labelText={t('services')}
            groupStatusText={
              getCheckboxGroupStatus() !== 'default'
                ? t('select-at-least-one-service')
                : ''
            }
            groupStatus={getCheckboxGroupStatus()}
          >
            <Checkbox
              checked={selectedServices.includes('terminologies')}
              disabled={getIsAlreadyRequested('TERMINOLOGY_EDITOR')}
              statusText={
                getIsAlreadyRequested('TERMINOLOGY_EDITOR')
                  ? t('access-already-requested')
                  : ''
              }
              onClick={({ checkboxState }) =>
                checkboxState
                  ? setSelectedServices(
                      selectedServices.concat('terminologies')
                    )
                  : setSelectedServices(
                      selectedServices.filter((s) => s !== 'terminologies')
                    )
              }
            >
              {t('terminologies')}
            </Checkbox>
            <Checkbox
              checked={selectedServices.includes('codelists')}
              disabled={getIsAlreadyRequested('CODE_LIST_EDITOR')}
              statusText={
                getIsAlreadyRequested('CODE_LIST_EDITOR')
                  ? t('access-already-requested')
                  : ''
              }
              onClick={({ checkboxState }) =>
                checkboxState
                  ? setSelectedServices(selectedServices.concat('codelists'))
                  : setSelectedServices(
                      selectedServices.filter((s) => s !== 'codelists')
                    )
              }
            >
              {t('code-lists')}
            </Checkbox>
            <Checkbox
              checked={selectedServices.includes('datamodels')}
              disabled={getIsAlreadyRequested('DATA_MODEL_EDITOR')}
              statusText={
                getIsAlreadyRequested('DATA_MODEL_EDITOR')
                  ? t('access-already-requested')
                  : ''
              }
              onClick={({ checkboxState }) =>
                checkboxState
                  ? setSelectedServices(selectedServices.concat('datamodels'))
                  : setSelectedServices(
                      selectedServices.filter((s) => s !== 'datamodels')
                    )
              }
            >
              {t('datamodel-title')}
            </Checkbox>
          </CheckboxGroup>
        </ModalContent>

        <ModalFooter>
          {userPosted &&
            postRequestResult.isError &&
            !postRequestResult.isLoading && (
              <div>
                <InlineAlert status="error">
                  {t('access-request-error')}
                </InlineAlert>
              </div>
            )}
          <Button
            onClick={() => handleSubmit()}
            disabled={postRequestResult.isLoading}
          >
            {t('send-request')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </NarrowModal>
    </>
  );
}
